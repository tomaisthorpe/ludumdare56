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

  private maxSpeed = 200; // Maximum speeda
  private minSpeed = 0.5; // Minimum speed when approaching target
  private slowdownDistance = 100; // Distance to start slowing down when leaving

  private sprite: TSpriteComponent;
  private easeDistance = 50; // Distance to start easing

  constructor(engine: TEngine) {
    super();

    this.sprite = new TSpriteComponent(
      engine,
      this,
      10,
      16,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_1
    );
    this.sprite.applyTexture(engine, scoutTexture);

    // Default scale to 0 to prevent first frame being 100%
    this.sprite.transform.scale = vec3.fromValues(0, 0, 1);
  }

  public setup(target: vec2, apiaryLocation: vec2): void {
    // Add small random offset to target
    this.target = vec2.add(
      vec2.create(),
      target,
      vec2.fromValues(Math.random() * 100 - 50, Math.random() * 100 - 50)
    );

    // Add small random offset to apiaryLocation
    this.apiaryLocation = vec2.add(
      vec2.create(),
      apiaryLocation,
      vec2.fromValues(Math.random() * 30 - 15, Math.random() * 8 - 4)
    );

    // Randmize the max speed between 100 and 200
    this.maxSpeed = Math.random() * 100 + 100;

    this.rootComponent.transform.translation = vec3.fromValues(
      this.apiaryLocation[0],
      this.apiaryLocation[1],
      0
    );
    this.leaving = true;
  }

  public reset(): void {
    this.target = null;
  }

  public async onUpdate(engine: TEngine, delta: number): Promise<void> {
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

    // Calculate scale based on distance to apiary
    const distanceToApiary = vec2.distance(
      vec2.fromValues(
        this.rootComponent.transform.translation[0],
        this.rootComponent.transform.translation[1]
      ),
      this.apiaryLocation!
    );

    const scale = Math.min(1, distanceToApiary / this.easeDistance);
    this.sprite.transform.scale = vec3.fromValues(scale, scale, 1);

    // Calculate speed based on whether leaving or returning
    let currentSpeed;
    if (this.leaving) {
      // Slow down when approaching target
      currentSpeed =
        this.maxSpeed -
        (this.maxSpeed - this.minSpeed) *
          Math.max(
            0,
            Math.min(
              1,
              (this.slowdownDistance - length) / this.slowdownDistance
            )
          );
    } else {
      // Constant speed when returning
      currentSpeed = this.maxSpeed;
    }

    // Move at calculated speed
    const normalizedDirection = vec2.normalize(vec2.create(), direction);
    vec3.scaleAndAdd(
      this.rootComponent.transform.translation,
      this.rootComponent.transform.translation,
      vec3.fromValues(normalizedDirection[0], normalizedDirection[1], 0),
      currentSpeed * delta
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
