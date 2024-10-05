import {
  TEngine,
  TFixedAxisCameraController,
  TGameState,
  TGameStateWithOnEnter,
  TOrthographicCamera,
  TResourcePack,
} from "@tedengine/ted";
import { vec3 } from "gl-matrix";
import ScoutBee from "./scout-bee";
import Garden from "./garden";
import Deposit from "./deposit";
import { NectarDeposit } from "./colony";

export default class NectarSearch
  extends TGameState
  implements TGameStateWithOnEnter
{
  private garden!: Garden;

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

    this.onReady(engine);
  }

  public async onEnter(_: TEngine, deposits: NectarDeposit[]) {
    this.garden.updateDeposits(deposits);
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
    // Figure out type of deposit, and if it's a new one.
    if (deposit.info.status != "available" || deposit.info.harvesting) {
      return;
    }

    this.engine.gameState.pop(deposit.info.id);
  }

  public onUpdate() {
    this.engine.updateGameContext({
      state: "nectarSearch",
    });
  }
}
