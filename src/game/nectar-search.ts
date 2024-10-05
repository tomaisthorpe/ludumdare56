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

export default class NectarSearch
  extends TGameState
  implements TGameStateWithOnEnter
{
  private garden!: Garden;
  private harvestingBeePool!: TActorPool<HarvestingBee>;
  public time: number = -0.25;

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
  }

  public onReady(engine: TEngine) {
    const camera = new TOrthographicCamera(engine);
    this.activeCamera = camera;
    this.addActor(camera);

    const scout = new ScoutBee(engine, this, camera);
    this.addActor(scout);

    const cameraController = new TFixedAxisCameraController({
      distance: 20,
      axis: "z",
      leadFactor: 0.8,
      maxLead: 150,
      lerpFactor: 0.99,
    });
    camera.controller = cameraController;
    cameraController.attachTo(scout.rootComponent);

    this.garden = new Garden(engine, this);
    this.addActor(this.garden);
  }

  public harvestDeposit(deposit: Deposit) {
    console.log("harvesting deposit", deposit.info);
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

  public onUpdate(_: TEngine, delta: number) {
    this.time += delta / 25;
    if (this.time > 0.5) {
      this.engine.gameState.pop({ failure: true });
      return;
    }

    // Randomly spawn bees
    if (this.time < 0.3 && Math.random() < 0.1) {
      this.spawnHarvestingBee();
    }

    this.engine.updateGameContext({
      state: "nectarSearch",
      time: this.time,
    });
  }
}
