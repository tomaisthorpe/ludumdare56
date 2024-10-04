import {
  TGameState,
  TEngine,
  TResourcePack,
  TOrthographicCamera,
} from "@tedengine/ted";

class GameState extends TGameState {
  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine);
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
  }
}

const gameConfig = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

new TEngine(gameConfig, self);
