import {
  TActor,
  TEngine,
  TOriginPoint,
  TResourcePackConfig,
  TSpriteComponent,
  TSpriteLayer,
  TTextureFilter,
} from "@tedengine/ted";
import apiaryTexture from "../assets/apiary.png";
import { vec3 } from "gl-matrix";

export default class Apiary extends TActor {
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

  constructor(engine: TEngine) {
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
}
