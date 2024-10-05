import { TGameState } from "@tedengine/ted";

export default class GameOver extends TGameState {
  public onCreate() {
    this.engine.updateGameContext({ state: "gameOver" });
  }

  public onUpdate() {
    this.engine.updateGameContext({ state: "gameOver" });
  }
}
