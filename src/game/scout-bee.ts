import {
  ICamera,
  TActorWithOnUpdate,
  TAnimatedSpriteComponent,
  TController,
  TEngine,
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
import scoutAnimation from "../assets/scout-animated-sheet.png";
import { quat, vec3, vec4 } from "gl-matrix";
import Deposit from "./deposit";
import NectarSearch from "./nectar-search";

export default class ScoutBee extends TPawn implements TActorWithOnUpdate {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: scoutTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: scoutAnimation,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  private sprite: TSpriteComponent;
  private shadow: TSpriteComponent;
  private simpleController: TTopDownController;

  public constructor(
    engine: TEngine,
    private state: NectarSearch,
    camera: ICamera
  ) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 1,
      fixedRotation: true,
      linearDamping: 2,
    });
    this.rootComponent.collider = new TSphereCollider(16, "Player");

    this.sprite = new TAnimatedSpriteComponent(
      engine,
      this,
      20,
      32,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_3,
      {
        frameCount: 4,
        frameRate: 20,
      }
    );
    this.sprite.applyTexture(engine, scoutAnimation);

    this.shadow = new TSpriteComponent(
      engine,
      this,
      20,
      32,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_2
    );
    this.shadow.colorFilter = vec4.fromValues(0, 0, 0, 0.5);
    this.shadow.applyTexture(engine, scoutTexture);

    this.simpleController = new TTopDownController(state.events, camera);
    this.simpleController.possess(this);
  }

  public setupController(controller: TController): void {
    super.setupController(controller);

    controller.bindAction("Space", "pressed", this.spacePressed.bind(this));
  }

  public async overDeposit() {
    // Check if we are colliding with a deposit
    const from = vec3.clone(this.rootComponent.getWorldTransform().translation);
    const to = vec3.add(
      vec3.create(),
      vec3.clone(this.rootComponent.getWorldTransform().translation),
      vec3.fromValues(0, 0, 1)
    );
    const result = await this.world?.queryLine(from, to);
    if (result) {
      for (const hit of result) {
        if (hit.actor instanceof Deposit) {
          return hit.actor as Deposit;
        }
      }
    }

    return null;
  }

  private async spacePressed() {
    // Check if we are colliding with a deposit
    const from = vec3.clone(this.rootComponent.getWorldTransform().translation);
    const to = vec3.add(
      vec3.create(),
      vec3.clone(this.rootComponent.getWorldTransform().translation),
      vec3.fromValues(0, 0, 1)
    );
    const result = await this.world?.queryLine(from, to);

    for (const hit of result ?? []) {
      if (hit.actor instanceof Deposit) {
        this.state.harvestDeposit(hit.actor as Deposit);
      }
    }
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

    this.shadow.transform.translation[0] = this.sprite.transform.translation[0];
    this.shadow.transform.translation[1] =
      this.sprite.transform.translation[1] -
      8 *
        (1 +
          Math.abs(
            Math.cos(
              (this.rootComponent.transform.translation[1] +
                this.rootComponent.transform.translation[0]) *
                0.01
            )
          ) *
            0.1);
    this.shadow.transform.translation[2] = this.sprite.transform.translation[2];
    this.shadow.transform.rotation = this.sprite.transform.rotation;
  }
}
