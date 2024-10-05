import {
  TEngine,
  TFixedAxisCameraController,
  TGameState,
  TOrthographicCamera,
  TResourcePack,
} from "@tedengine/ted";
import { vec3 } from "gl-matrix";
import ScoutBee from "./scout-bee";

export default class NectarSearch extends TGameState {
  public beforeWorldCreate() {
    this.world!.config.mode = "2d";
    this.world!.config.gravity = vec3.fromValues(0, 0, 0);
    this.world!.config.collisionClasses.push({
      name: "Player",
    });
  }

  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, ScoutBee.resources);
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
      leadFactor: 0.5,
      maxLead: 150,
      lerpFactor: 0.1,
    });
    camera.controller = cameraController;
    cameraController.attachTo(scout.rootComponent);
  }

  public onUpdate() {}
}
