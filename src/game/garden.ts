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
import { NectarDeposit } from "./colony";

const howmanygrass = 40;
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

  public deposits: Deposit[] = [];

  public constructor(private engine: TEngine, private state: TGameState) {
    super();

    const grass = new TSpriteComponent(
      engine,
      this,
      128 * howmanygrass,
      128 * howmanygrass,
      TOriginPoint.Center,
      TSpriteLayer.Background_0
    );
    grass.instanceUVScales = [howmanygrass, howmanygrass];
    grass.applyTexture(engine, grassTexture);
  }

  public updateDeposits(deposits: NectarDeposit[]) {
    deposits.forEach((deposit) => {
      // Check if deposit already exists
      const existingDeposit = this.deposits.find(
        (d) => d.info.id === deposit.id
      );
      if (existingDeposit) {
        existingDeposit.updateInfo(deposit);
        return;
      }

      const d = new Deposit(this.engine, deposit.x, deposit.y, deposit);
      this.deposits.push(d);
      this.state.addActor(d);
    });
  }
}
