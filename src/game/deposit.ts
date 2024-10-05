import {
  TActor,
  TEngine,
  TOriginPoint,
  TSpriteLayer,
  TSpriteComponent,
  TResourcePackConfig,
  TTextureFilter,
  TBoxCollider,
  TSceneComponent,
} from "@tedengine/ted";
import depositTexture from "../assets/flower.png";
import { vec3 } from "gl-matrix";

export default class Deposit extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: depositTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  public constructor(engine: TEngine, x: number, y: number) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 0,
      fixedRotation: true,
      isTrigger: true,
    });
    this.rootComponent.collider = new TBoxCollider(192, 128, 128, "Deposit");

    const sprite = new TSpriteComponent(
      engine,
      this,
      192,
      128,
      TOriginPoint.Center,
      TSpriteLayer.Midground_0
    );
    sprite.applyTexture(engine, depositTexture);

    this.rootComponent.transform.translation = vec3.fromValues(x, y, 0);
  }
}
