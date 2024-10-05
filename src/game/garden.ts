import {
  TSpriteComponent,
  TOriginPoint,
  TSpriteLayer,
  TResourcePackConfig,
  TTextureFilter,
  TActor,
  TEngine,
  TGameState,
} from "@tedengine/ted";
import grassTexture from "../assets/grass.png";
import Deposit from "./deposit";

export default class Garden extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: grassTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  public constructor(engine: TEngine, state: TGameState) {
    super();

    const grass = new TSpriteComponent(
      engine,
      this,
      128,
      128,
      TOriginPoint.Center,
      TSpriteLayer.Background_0
    );
    grass.applyTexture(engine, grassTexture);

    const deposit = new Deposit(engine, 100, 100);
    state.addActor(deposit);
  }
}
