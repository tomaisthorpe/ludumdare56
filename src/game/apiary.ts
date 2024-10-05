import {
  TActor,
  TActorWithOnUpdate,
  TEngine,
  TOriginPoint,
  TResourcePackConfig,
  TSpriteComponent,
  TSpriteLayer,
  TTextureFilter,
  TParticlesComponent,
} from "@tedengine/ted";
import apiaryTexture from "../assets/apiary.png";
import backgroundTexture from "../assets/background.png";
import rainTexture from "../assets/rain.png";
import GameState from "./game";

import { vec3, vec4 } from "gl-matrix";
import Colony from "./colony";
import config from "./config";
export default class Apiary extends TActor implements TActorWithOnUpdate {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: apiaryTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: backgroundTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: rainTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  private rain: TParticlesComponent;
  private rainEnabled = false;
  private rainTransition = 0; // New property to track transition progress

  private sprite: TSpriteComponent;
  private background: TSpriteComponent;

  constructor(
    engine: TEngine,
    private colony: Colony,
    private spawnBee: (isLeaving: boolean) => void,
    private state: GameState
  ) {
    super();

    this.sprite = new TSpriteComponent(
      engine,
      this,
      800,
      600,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0
    );
    this.sprite.applyTexture(engine, apiaryTexture);

    this.background = new TSpriteComponent(
      engine,
      this,
      800,
      600,
      TOriginPoint.Center,
      TSpriteLayer.Background_0
    );
    this.background.applyTexture(engine, backgroundTexture);

    // Rain
    this.rain = new TParticlesComponent(
      engine,
      this,
      2,
      4,
      {
        emitter: {
          maxParticles: 500,
          maxEmitRate: 100,
          minEmitRate: 100,
        },
        initializers: {
          ttl: 3,
          position: () => {
            const x = Math.random() * 800 - 400;
            const y = 400;
            return vec3.fromValues(x, y, 0);
          },
          scale: () => {
            return vec3.fromValues(Math.random() * 0.5 + 1, 1, 1);
          },
        },
        behaviours: {
          force: vec3.fromValues(-1, -10, 0),
        },
      },
      TSpriteLayer.Foreground_4
    );
    this.rain.applyTexture(engine, rainTexture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -50);
  }

  public async onUpdate(): Promise<void> {
    // Spawn bee rate depends on how many bees we have
    const spawnRate =
      this.colony.calculateHoneyProduction(this.state.currentDate) > 0 &&
      !this.rainEnabled
        ? config.apiary.spawnRatePerBee * this.colony.numBees
        : 0;
    if (Math.random() < spawnRate) {
      // Randomly spawn a bee arriving or leaving
      this.spawnBee(Math.random() < 0.5);
    }

    // Check if it's raining
    const isRaining = this.colony.isRaining(this.state.currentDate);

    if (isRaining && !this.rainEnabled) {
      this.rainEnabled = true;
    } else if (!isRaining && this.rainEnabled) {
      this.rainEnabled = false;
    }

    const transitionSpeed = 0.025;
    if (this.rainEnabled && this.rainTransition < 1) {
      this.rainTransition = Math.min(this.rainTransition + transitionSpeed, 1);
    } else if (!this.rainEnabled && this.rainTransition > 0) {
      this.rainTransition = Math.max(this.rainTransition - transitionSpeed, 0);
    }

    // Apply interpolated color filter
    const normalColor = vec4.fromValues(1, 1, 1, 1);
    const rainColor = vec4.fromValues(0.4, 0.4, 0.5, 1);
    const interpolatedColor = vec4.create();
    vec4.lerp(interpolatedColor, normalColor, rainColor, this.rainTransition);

    this.background.colorFilter = interpolatedColor;
    this.sprite.colorFilter = interpolatedColor;

    // Update rain visibility
    this.rain.shouldRender = this.rainTransition > 0;
  }
}
