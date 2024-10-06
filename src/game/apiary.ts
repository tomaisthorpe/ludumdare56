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
import cloudTexture from "../assets/cloud.png";
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
      {
        url: cloudTexture,
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
  private cloud: TSpriteComponent;
  private cloudPosition: number = -600; // Starting position off-screen to the left
  private cloudSpeed: number = 10; // Pixels per second

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

    this.cloud = new TSpriteComponent(
      engine,
      this,
      196 * 2,
      128 * 2,
      TOriginPoint.Center,
      TSpriteLayer.Background_1
    );
    this.cloud.colorFilter = vec4.fromValues(1, 1, 1, 0.2);
    this.cloud.applyTexture(engine, cloudTexture);
    this.cloud.transform.translation = vec3.fromValues(
      this.cloudPosition,
      Math.random() * 150 + 150,
      0
    );

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

  public async onUpdate(_: TEngine, deltaTime: number): Promise<void> {
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

    // Update cloud position
    this.cloudPosition += this.cloudSpeed * deltaTime;
    if (this.cloudPosition > 900) {
      // 800 (screen width) + 100 (half cloud width)
      this.cloudPosition = -500; // Reset to starting position
      // Randomise cloud y between 150 and 250
      this.cloud.transform.translation[1] = Math.random() * 150 + 150;
    }
    this.cloud.transform.translation = vec3.fromValues(
      this.cloudPosition,
      this.cloud.transform.translation[1],
      0
    );
  }
}
