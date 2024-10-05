import {
  TEngine,
  TFixedAxisCameraController,
  TGameState,
  TOrthographicCamera,
  TResourcePack,
} from "@tedengine/ted";
import { vec3 } from "gl-matrix";
import ScoutBee from "./scout-bee";
import Garden from "./garden";
import Deposit from "./deposit";

export default class NectarSearch extends TGameState {
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

    const garden = new Garden(engine, this);
    this.addActor(garden);
  }

  public onUpdate() {}
}
