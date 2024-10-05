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
import { vec3 } from "gl-matrix";

export default class Apiary extends TActor implements TActorWithOnUpdate {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: apiaryTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  constructor(engine: TEngine, private spawnBee: () => void) {
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

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -50);
  }

  public async onUpdate(): Promise<void> {
    if (Math.random() < 0.1) {
      this.spawnBee();
    }
  }
}
