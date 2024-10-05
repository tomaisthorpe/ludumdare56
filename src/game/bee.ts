import {
  TActor,
  TEngine,
  TOriginPoint,
  TSpriteComponent,
  TSpriteLayer,
  TResourcePackConfig,
  TTextureFilter,
  TPoolableActor,
  TActorPool,
} from "@tedengine/ted";
import beeTexture from "../assets/bee.png";
import { vec3 } from "gl-matrix";

export default class Bee extends TActor implements TPoolableActor {
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

  private coef = 0;
  private life = 0;
  private xSpeed = 400;
  private ySpeed = 100;

  // Required for the pool
  public pool!: TActorPool<Bee>;
  public acquired = false;

  constructor(engine: TEngine) {
    super();

    const sprite = new TSpriteComponent(
      engine,
      this,
      32,
      20,
      TOriginPoint.Center,
      TSpriteLayer.Midground_0
    );
    sprite.applyTexture(engine, beeTexture);

    this.rootComponent.transform.translation = vec3.fromValues(100, -230, -50);

    this.coef = Math.random() * 1 + 0.5;
  }

  public reset(): void {
    // Generate a coef between 0.5 and 1.5
    this.coef = Math.random() * 1 + 0.5;

    this.life = 0;

    this.rootComponent.transform.translation = vec3.fromValues(100, -230, -50);
  }

  public onUpdate(_: TEngine, delta: number): void {
    if (!this.acquired) return;

    this.life += delta;

    const x = -this.life * this.xSpeed + 100;
    const y = this.coef * Math.pow(this.life, 2) * this.ySpeed - 230;

    this.rootComponent.transform.translation = vec3.fromValues(x, y, -50);
    if (x < -450) {
      this.pool.release(this);
    }
  }
}
