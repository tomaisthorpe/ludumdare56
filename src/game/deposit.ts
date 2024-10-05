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
import hereBeNectarTexture from "../assets/here-be-nectar.png";
import { vec3 } from "gl-matrix";
import { NectarDeposit } from "./colony";

export default class Deposit extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: depositTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: hereBeNectarTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  public constructor(
    engine: TEngine,
    x: number,
    y: number,
    public info: NectarDeposit
  ) {
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

    // If status is new, add the marker to show player
    if (info.status === "available" && !info.harvesting) {
      const marker = new TSpriteComponent(
        engine,
        this,
        16,
        33,
        TOriginPoint.Center,
        TSpriteLayer.Midground_1
      );
      marker.applyTexture(engine, hereBeNectarTexture);
    }

    this.rootComponent.transform.translation = vec3.fromValues(x, y, 0);
  }
}
