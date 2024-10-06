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
  public honeyReserves?: number;

  public async onCreate() {
    this.engine.updateGameContext({ state: "gameOver" });
  }

  public async onEnter(
    _: TEngine,
    {
      success,
      reason,
      honeyReserves,
    }: { success: boolean; reason: string; honeyReserves: number }
  ) {
    this.success = success;
    this.reason = reason;
    this.honeyReserves = honeyReserves;
    this.engine.updateGameContext({
      state: "gameOver",
      success,
      reason,
      honeyReserves,
    });
  }

  public onUpdate() {
    this.engine.updateGameContext({
      state: "gameOver",
      success: this.success,
      reason: this.reason,
      honeyReserves: this.honeyReserves,
    });
  }
}
