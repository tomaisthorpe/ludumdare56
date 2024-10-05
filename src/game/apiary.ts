import {
  TActor,
  TActorWithOnUpdate,
  TEngine,
  TOriginPoint,
  TResourcePackConfig,
  TSpriteComponent,
  TSpriteLayer,
  TTextureFilter,
} from "@tedengine/ted";
import apiaryTexture from "../assets/apiary.png";
import backgroundTexture from "../assets/background.png";
import GameState from "./game";

import { vec3 } from "gl-matrix";
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
    ],
  };

  constructor(
    engine: TEngine,
    private colony: Colony,
    private spawnBee: (isLeaving: boolean) => void,
    private state: GameState
  ) {
    super();

    const sprite = new TSpriteComponent(
      engine,
      this,
      800,
      600,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0
    );
    sprite.applyTexture(engine, apiaryTexture);

    const background = new TSpriteComponent(
      engine,
      this,
      800,
      600,
      TOriginPoint.Center,
      TSpriteLayer.Background_0
    );
    background.applyTexture(engine, backgroundTexture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -50);
  }

  public async onUpdate(): Promise<void> {
    // Spawn bee rate depends on how many bees we have
    const spawnRate =
      this.colony.calculateHoneyProduction(this.state.currentDate) > 0
        ? config.apiary.spawnRatePerBee * this.colony.numBees
        : 0;
    if (Math.random() < spawnRate) {
      // Randomly spawn a bee arriving or leaving
      this.spawnBee(Math.random() < 0.5);
    }
  }
}
