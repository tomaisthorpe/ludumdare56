import {
  TGameState,
  TEngine,
  TResourcePack,
  TOrthographicCamera,
  TActorPool,
} from "@tedengine/ted";
import Apiary from "./apiary";
import Bee from "./bee";

class GameState extends TGameState {
  public beePool!: TActorPool<Bee>;

  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, Apiary.resources, Bee.resources);
    await rp.load();

    this.beePool = new TActorPool<Bee>(() => new Bee(engine), 100);
    this.spawnBee = this.spawnBee.bind(this);

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

    const apiary = new Apiary(engine, this.spawnBee);
    this.addActor(apiary);
  }

  public spawnBee() {
    const bee = this.beePool.acquire();
    if (bee) {
      this.addActor(bee);
    }
  }
}

const gameConfig = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

new TEngine(gameConfig, self);
