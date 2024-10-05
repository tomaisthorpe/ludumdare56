import {
  TGameState,
  TEngine,
  TResourcePack,
  TOrthographicCamera,
} from "@tedengine/ted";
import Apiary from "./apiary";
import Bee from "./bee";

class GameState extends TGameState {
  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, Apiary.resources, Bee.resources);
    await rp.load();

    this.onReady(engine);
  }

  public beforeWorldCreate() {
    this.world!.config.mode = "2d";
  }

  public onUpdate() {}
  public onReady(engine: TEngine) {
    const camera = new TOrthographicCamera(engine);
    this.activeCamera = camera;
    this.addActor(camera);

    const apiary = new Apiary(engine);
    this.addActor(apiary);

    const bee = new Bee(engine);
    this.addActor(bee);
  }
}

const gameConfig = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

new TEngine(gameConfig, self);
