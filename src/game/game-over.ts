import {
  TEngine,
  TGameState,
  TGameStateWithOnCreate,
  TGameStateWithOnEnter,
} from "@tedengine/ted";

export default class GameOver
  extends TGameState
  implements TGameStateWithOnCreate, TGameStateWithOnEnter
{
  public success?: boolean;
  public reason?: string;

  public async onCreate() {
    this.engine.updateGameContext({ state: "gameOver" });
  }

  public async onEnter(
    _: TEngine,
    { success, reason }: { success: boolean; reason: string }
  ) {
    console.log("GameOver.onEnter", success, reason);
    this.success = success;
    this.reason = reason;
    this.engine.updateGameContext({ state: "gameOver", success, reason });
  }

  public onUpdate() {
    this.engine.updateGameContext({
      state: "gameOver",
      success: this.success,
      reason: this.reason,
    });
  }
}
