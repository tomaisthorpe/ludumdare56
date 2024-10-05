import {
  ICamera,
  TActorWithOnUpdate,
  TEngine,
  TGameState,
  TOriginPoint,
  TPawn,
  TResourcePackConfig,
  TSceneComponent,
  TSphereCollider,
  TSpriteComponent,
  TSpriteLayer,
  TTextureFilter,
  TTopDownController,
} from "@tedengine/ted";
import scoutTexture from "../assets/scout.png";
import { quat, vec3, vec4 } from "gl-matrix";

export default class ScoutBee extends TPawn implements TActorWithOnUpdate {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: scoutTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  private sprite: TSpriteComponent;
  private shadow: TSpriteComponent;
  private simpleController: TTopDownController;

  public constructor(engine: TEngine, state: TGameState, camera: ICamera) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 1,
      fixedRotation: true,
    });
    this.rootComponent.collider = new TSphereCollider(16, "Player");

    this.sprite = new TSpriteComponent(
      engine,
      this,
      20,
      32,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0
    );
    this.sprite.applyTexture(engine, scoutTexture);

    this.shadow = new TSpriteComponent(
      engine,
      this,
      20,
      32,
      TOriginPoint.Center,
      TSpriteLayer.Midground_0
    );
    this.shadow.colorFilter = vec4.fromValues(0, 0, 0, 0.5);
    this.shadow.applyTexture(engine, scoutTexture);

    this.shadow.attachTo(this.sprite);

    this.simpleController = new TTopDownController(state.events, camera);
    this.simpleController.possess(this);
  }

  async onUpdate(): Promise<void> {
    this.simpleController.update();

    const force = 1000;
    this.rootComponent.applyCentralForce(
      vec3.fromValues(
        force * this.simpleController.getAxisValue("Horizontal"),
        force * this.simpleController.getAxisValue("Vertical"),
        0
      )
    );

    const q = quat.fromEuler(
      quat.create(),
      0,
      0,
      (this.simpleController.angle * 180) / Math.PI + 90
    );

    this.sprite.transform.rotation = q;
  }
}
