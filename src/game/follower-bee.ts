import { quat, vec3 } from "gl-matrix";
import scoutTexture from "../assets/scout.png";
import {
  TActor,
  TEngine,
  TOriginPoint,
  TResourcePackConfig,
  TSpriteComponent,
  TSpriteLayer,
  TTextureFilter,
  TActorWithOnUpdate,
} from "@tedengine/ted";
import ScoutBee from "./scout-bee";
import NectarSearch from "./nectar-search";

export default class FollowerBee extends TActor implements TActorWithOnUpdate {
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
  private velocity: vec3 = vec3.create();
  private maxSpeed: number = 10;
  private maxForce: number = 0.05;
  private previousPosition: vec3 = vec3.create();
  private minScoutDistance: number = 50; // Minimum distance to keep from the scout

  constructor(
    engine: TEngine,
    private scout: ScoutBee,
    private state: NectarSearch
  ) {
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

    // Initialize previousPosition
    vec3.copy(this.previousPosition, this.rootComponent.transform.translation);
  }

  private otherFollowers(): FollowerBee[] {
    return this.state.followerBees.filter((bee) => bee !== this);
  }

  public async onUpdate(): Promise<void> {
    const scoutLocation =
      this.scout.rootComponent.getWorldTransform().translation;
    const currentPosition = this.rootComponent.transform.translation;

    const separation = this.separate();
    const alignment = this.align();
    const cohesion = this.cohesion();
    const followScout = this.followScout(scoutLocation);
    const separateFromScout = this.separateFromScout(scoutLocation);

    // Apply forces
    vec3.scaleAndAdd(this.velocity, this.velocity, separation, 1.8);
    vec3.scaleAndAdd(this.velocity, this.velocity, alignment, 1.0);
    vec3.scaleAndAdd(this.velocity, this.velocity, cohesion, 1.0);
    vec3.scaleAndAdd(this.velocity, this.velocity, followScout, 3);
    vec3.scaleAndAdd(this.velocity, this.velocity, separateFromScout, 2.5); // Add separation from scout

    // Limit velocity
    if (vec3.length(this.velocity) > this.maxSpeed) {
      vec3.normalize(this.velocity, this.velocity);
      vec3.scale(this.velocity, this.velocity, this.maxSpeed);
    }

    // Update position
    vec3.add(currentPosition, currentPosition, this.velocity);
    this.rootComponent.transform.translation = currentPosition;

    // Calculate rotation based on movement
    this.updateRotation();

    // Update previousPosition for the next frame
    vec3.copy(this.previousPosition, currentPosition);
  }

  private separate(): vec3 {
    const desiredSeparation = 25;
    const steer = vec3.create();
    let count = 0;

    for (const other of this.otherFollowers()) {
      const d = vec3.distance(
        this.rootComponent.transform.translation,
        other.rootComponent.transform.translation
      );
      if (d > 0 && d < desiredSeparation) {
        const diff = vec3.create();
        vec3.subtract(
          diff,
          this.rootComponent.transform.translation,
          other.rootComponent.transform.translation
        );
        vec3.normalize(diff, diff);
        vec3.scale(diff, diff, 1 / d);
        vec3.add(steer, steer, diff);
        count++;
      }
    }

    if (count > 0) {
      vec3.scale(steer, steer, 1 / count);
    }

    if (vec3.length(steer) > 0) {
      vec3.normalize(steer, steer);
      vec3.scale(steer, steer, this.maxSpeed);
      vec3.subtract(steer, steer, this.velocity);
      this.limitForce(steer);
    }

    return steer;
  }

  private align(): vec3 {
    const neighborDist = 50;
    const sum = vec3.create();
    let count = 0;

    for (const other of this.otherFollowers()) {
      const d = vec3.distance(
        this.rootComponent.transform.translation,
        other.rootComponent.transform.translation
      );
      if (d > 0 && d < neighborDist) {
        vec3.add(sum, sum, other.velocity);
        count++;
      }
    }

    if (count > 0) {
      vec3.scale(sum, sum, 1 / count);
      vec3.normalize(sum, sum);
      vec3.scale(sum, sum, this.maxSpeed);
      const steer = vec3.create();
      vec3.subtract(steer, sum, this.velocity);
      this.limitForce(steer);
      return steer;
    }
    return vec3.create();
  }

  private cohesion(): vec3 {
    const neighborDist = 50;
    const sum = vec3.create();
    let count = 0;

    for (const other of this.otherFollowers()) {
      const d = vec3.distance(
        this.rootComponent.transform.translation,
        other.rootComponent.transform.translation
      );
      if (d > 0 && d < neighborDist) {
        vec3.add(sum, sum, other.rootComponent.transform.translation);
        count++;
      }
    }

    if (count > 0) {
      vec3.scale(sum, sum, 1 / count);
      return this.seek(sum);
    }
    return vec3.create();
  }

  private followScout(scoutLocation: vec3): vec3 {
    return this.seek(scoutLocation);
  }

  private seek(target: vec3): vec3 {
    const desired = vec3.create();
    vec3.subtract(desired, target, this.rootComponent.transform.translation);
    vec3.normalize(desired, desired);
    vec3.scale(desired, desired, this.maxSpeed);

    const steer = vec3.create();
    vec3.subtract(steer, desired, this.velocity);
    this.limitForce(steer);
    return steer;
  }

  private limitForce(force: vec3): void {
    if (vec3.length(force) > this.maxForce) {
      vec3.normalize(force, force);
      vec3.scale(force, force, this.maxForce);
    }
  }

  private updateRotation(): void {
    const currentPosition = this.rootComponent.transform.translation;
    const movement = vec3.create();
    vec3.subtract(movement, currentPosition, this.previousPosition);

    if (vec3.length(movement) > 0.001) {
      // Only rotate if there's significant movement
      const angle = Math.atan2(movement[1], movement[0]);
      this.rootComponent.transform.rotation = quat.fromEuler(
        this.rootComponent.transform.rotation,
        0,
        0,
        ((angle + Math.PI / 2) * 180) / Math.PI
      );
    }
  }

  private separateFromScout(scoutLocation: vec3): vec3 {
    const steer = vec3.create();
    const d = vec3.distance(
      this.rootComponent.transform.translation,
      scoutLocation
    );

    if (d < this.minScoutDistance) {
      const diff = vec3.create();
      vec3.subtract(
        diff,
        this.rootComponent.transform.translation,
        scoutLocation
      );
      vec3.normalize(diff, diff);
      vec3.scale(diff, diff, this.minScoutDistance - d);
      vec3.add(steer, steer, diff);

      vec3.normalize(steer, steer);
      vec3.scale(steer, steer, this.maxSpeed);
      vec3.subtract(steer, steer, this.velocity);
      this.limitForce(steer);
    }

    return steer;
  }
}
