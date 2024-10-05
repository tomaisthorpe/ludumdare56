import {
  TGameState,
  TEngine,
  TResourcePack,
  TOrthographicCamera,
  TActorPool,
  TGameStateWithOnResume,
} from "@tedengine/ted";
import Apiary from "./apiary";
import Bee from "./bee";
import Colony from "./colony";
import config from "./config";
import NectarSearch from "./nectar-search";
import GameOver from "./game-over";

export default class GameState
  extends TGameState
  implements TGameStateWithOnResume
{
  public beePool!: TActorPool<Bee>;
  public colony = new Colony();

  public currentDate: Date = new Date(
    new Date().setMonth(config.startingMonth, config.startingDay)
  );
  private timeSinceStartDay = -1;

  public notice?: string;
  public noticeTime = 0;

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

  public setNotice(notice: string) {
    this.notice = notice;
    this.noticeTime = 5;
  }

  public async onResume(
    _: TEngine,
    { depositId, failure }: { depositId?: number; failure?: boolean }
  ) {
    if (depositId !== undefined) {
      // Set the deposit to harvesting
      this.colony.nectarDeposits.find((d) => d.id === depositId)!.harvesting =
        true;
    }

    if (failure) {
      this.setNotice("You didn't return, half your bees have died.");
      this.colony.killBees(this.colony.numBees * 0.5);
    }
  }

  public onUpdate(_: TEngine, delta: number) {
    if (
      this.timeSinceStartDay > config.timePerDay ||
      this.timeSinceStartDay < 0
    ) {
      this.timeSinceStartDay = 0;
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.colony.step(this.currentDate);
    }
    this.timeSinceStartDay += delta;

    if (this.colony.numBees <= 0 && this.colony.numBrood <= 0) {
      this.engine.gameState.switch("gameOver");
      return;
    }

    if (this.noticeTime > 0) {
      this.noticeTime -= delta;
    }

    // Share colony stats with UI
    const ctx = {
      state: "game",
      colony: {
        numBees: this.colony.numBees,
        numBrood: this.colony.numBrood,
        layingRate: this.colony.layingRate,
        honeyReserves: this.colony.honeyReserves,
        honeyConsumption: this.colony.calculateHoneyConsumption(),
        honeyProduction: this.colony.calculateHoneyProduction(this.currentDate),
        howLongWillHoneyLast: this.colony.howLongWillHoneyLast(),
      },
      isRaining: this.colony.isRaining(this.currentDate),
      nectarDeposits: this.colony.nectarDeposits,
      events: config.events,
      date: this.currentDate,
      notice: this.noticeTime > 0 ? this.notice : undefined,
    };

    this.engine.updateGameContext(ctx);
  }

  public onReady(engine: TEngine) {
    const camera = new TOrthographicCamera(engine);
    this.activeCamera = camera;
    this.addActor(camera);

    const apiary = new Apiary(engine, this.colony, this.spawnBee, this);
    this.addActor(apiary);

    this.events.addListener<{
      type: "CHANGE_LAYING_RATE";
      payload: { rate: number };
    }>("CHANGE_LAYING_RATE", (event) => {
      if (event.payload.rate < 0) {
        event.payload.rate = 0;
      } else if (event.payload.rate > 5) {
        event.payload.rate = 5;
      }
      this.colony.layingRate = event.payload.rate;
    });

    this.events.addListener<{
      type: "GO_SEARCH_FOR_NECTAR";
    }>("GO_SEARCH_FOR_NECTAR", () => {
      this.engine.gameState.push("nectarSearch", this.colony.nectarDeposits);
    });
  }

  public spawnBee(isLeaving: boolean) {
    const bee = this.beePool.acquire();
    if (bee) {
      bee.setup(isLeaving);
      this.addActor(bee);
    }
  }
}

const gameConfig = {
  states: {
    game: GameState,
    nectarSearch: NectarSearch,
    gameOver: GameOver,
  },
  defaultState: "game",
};

new TEngine(gameConfig, self);
