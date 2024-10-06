import {
  TActorPool,
  TEngine,
  TFixedAxisCameraController,
  TGameState,
  TGameStateWithOnEnter,
  TOrthographicCamera,
  TResourcePack,
} from "@tedengine/ted";
import { vec3, vec2 } from "gl-matrix";
import ScoutBee from "./scout-bee";
import Garden from "./garden";
import Deposit from "./deposit";
import { NectarDeposit } from "./colony";
import HarvestingBee from "./harvesting-bee";
import FollowerBee from "./follower-bee";

const followerBees = 10;

export default class NectarSearch
  extends TGameState
  implements TGameStateWithOnEnter
{
  private garden!: Garden;
  private harvestingBeePool!: TActorPool<HarvestingBee>;
  public time: number = -0.25;

  private scoutBee!: ScoutBee;
  public followerBees: FollowerBee[] = [];
  private overDeposit: Deposit | null = null;

  public beforeWorldCreate() {
    this.world!.config.mode = "2d";
    this.world!.config.gravity = vec3.fromValues(0, 0, 0);
    this.world!.config.collisionClasses.push({
      name: "Player",
    });

    this.world!.config.collisionClasses.push({
      name: "Deposit",
    });
  }

  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(
      engine,
      ScoutBee.resources,
      Garden.resources,
      Deposit.resources
    );
    await rp.load();

    this.harvestingBeePool = new TActorPool<HarvestingBee>(
      () => new HarvestingBee(engine),
      100
    );

    this.onReady(engine);
  }

  public async onEnter(_: TEngine, deposits: NectarDeposit[]) {
    this.garden.updateDeposits(deposits);
    this.time = -0.25;

    // Reset the player's position
    this.scoutBee.rootComponent.transform.translation = vec3.fromValues(
      0,
      0,
      0
    );
    this.scoutBee.rootComponent.setLinearVelocity(vec3.fromValues(0, 0, 0));
    this.scoutBee.rootComponent.applyTransform();
  }

  public onReady(engine: TEngine) {
    const camera = new TOrthographicCamera(engine);
    this.activeCamera = camera;
    this.addActor(camera);

    this.scoutBee = new ScoutBee(engine, this, camera);
    this.addActor(this.scoutBee);

    const cameraController = new TFixedAxisCameraController({
      distance: 20,
      axis: "z",
      leadFactor: 0.8,
      maxLead: 150,
      lerpFactor: 0.99,
      bounds: {
        min: vec3.fromValues(-1380, -1480, -100),
        max: vec3.fromValues(1380, 1480, 100),
      },
    });
    camera.controller = cameraController;
    cameraController.attachTo(this.scoutBee.rootComponent);

    this.garden = new Garden(engine, this);
    this.addActor(this.garden);

    for (let i = 0; i < followerBees; i++) {
      const bee = new FollowerBee(engine, this.scoutBee, this);
      this.addActor(bee);

      this.followerBees.push(bee);
    }
  }

  public harvestDeposit(deposit: Deposit) {
    // Figure out type of deposit, and if it's a new one.
    if (deposit.info.status != "available" || deposit.info.harvesting) {
      return;
    }

    this.engine.gameState.pop({ depositId: deposit.info.id });
  }

  private spawnHarvestingBee() {
    // Choose random harvesting deposit
    const deposit = this.garden.deposits.filter(
      (d) => d.info.status == "available" && d.info.harvesting
    )[Math.floor(Math.random() * this.garden.deposits.length)];

    if (!deposit) {
      return;
    }

    const bee = this.harvestingBeePool.acquire();
    if (bee) {
      bee.setup(
        vec2.fromValues(deposit.info.x, deposit.info.y),
        vec2.fromValues(0, 52)
      );
      this.addActor(bee);
    }
  }

  public async onUpdate(_: TEngine, delta: number) {
    this.time += delta / 25;
    if (this.time > 0.5) {
      this.engine.gameState.pop({ failure: true });
      return;
    }

    // Check if we are colliding with a deposit
    this.overDeposit = await this.scoutBee.overDeposit();

    // Randomly spawn bees
    if (this.time < 0.3 && Math.random() < 0.1) {
      this.spawnHarvestingBee();
    }

    this.engine.updateGameContext({
      state: "nectarSearch",
      time: this.time,
      overDeposit: this.overDeposit?.info,
    });
  }
}
