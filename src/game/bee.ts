import {
  TActor,
  TEngine,
  TOriginPoint,
  TSpriteComponent,
  TSpriteLayer,
  TResourcePackConfig,
  TTextureFilter,
} from "@tedengine/ted";
import beeTexture from "../assets/bee.png";
import { vec3 } from "gl-matrix";
export default class Bee extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: beeTexture,
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
      32,
      20,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0
    );
    sprite.applyTexture(engine, beeTexture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -50);
  }
}
