import { quat, vec2, vec3 } from "gl-matrix";
import scoutTexture from "../assets/scout.png";
import {
  TActor,
  TEngine,
  TOriginPoint,
  TPoolableActor,
  TResourcePackConfig,
  TSpriteComponent,
  TSpriteLayer,
  TActorPool,
  TTextureFilter,
  TActorWithOnUpdate,
} from "@tedengine/ted";

export default class HarvestingBee
  extends TActor
  implements TPoolableActor, TActorWithOnUpdate
{
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

  public pool!: TActorPool<HarvestingBee>;
  public acquired = false;

  private target: vec2 | null = null;
  private apiaryLocation: vec2 | null = null;
  private leaving = false;

  private speed = 1;

  constructor(engine: TEngine) {
    super();

    const sprite = new TSpriteComponent(
      engine,
      this,
      16,
      20,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_1
    );
    sprite.applyTexture(engine, scoutTexture);
  }

  public setup(target: vec2, apiaryLocation: vec2): void {
    this.target = target;
    this.apiaryLocation = apiaryLocation;
    this.leaving = true;
  }

  public reset(): void {
    this.target = null;
  }

  public async onUpdate(_: TEngine, delta: number): Promise<void> {
    if (!this.target) return;

    const direction = vec2.sub(
      vec2.create(),
      this.target,
      vec2.fromValues(
        this.rootComponent.transform.translation[0],
        this.rootComponent.transform.translation[1]
      )
    );
    const length = vec2.length(direction);
    if (length < 5) {
      if (this.leaving) {
        this.target = this.apiaryLocation;
        this.leaving = false;
      } else {
        this.pool.release(this);
      }
    }
    const clampedSpeed = Math.min(this.speed, length);
    vec3.scaleAndAdd(
      this.rootComponent.transform.translation,
      this.rootComponent.transform.translation,
      vec3.fromValues(direction[0], direction[1], 0),
      clampedSpeed * delta
    );

    // Rotate towards target
    const angle = Math.atan2(direction[1], direction[0]);
    this.rootComponent.transform.rotation = quat.fromEuler(
      quat.create(),
      0,
      0,
      (angle * 180) / Math.PI - 90
    );
  }
}
