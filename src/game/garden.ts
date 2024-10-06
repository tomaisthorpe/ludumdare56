import {
  TSpriteComponent,
  TOriginPoint,
  TSpriteLayer,
  TResourcePackConfig,
  TTextureFilter,
  TActor,
  TEngine,
  TActorWithOnUpdate,
} from "@tedengine/ted";
import grassTexture from "../assets/grass.png";
import apiaryTopTexture from "../assets/apiary-top.png";
import whiteTexture from "../assets/white.png";
import treeTexture from "../assets/tree.png";
import bushTexture from "../assets/bush.png";
import rockTexture from "../assets/rock.png";
import Deposit from "./deposit";
import { NectarDeposit } from "./colony";
import { quat, vec3, vec4 } from "gl-matrix";
import NectarSearch from "./nectar-search";
import Noise from "noise-ts";

const howmanygrass = 40;
const gardenSize = howmanygrass * 128;
export default class Garden extends TActor implements TActorWithOnUpdate {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: grassTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: apiaryTopTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: whiteTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: treeTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: bushTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: rockTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  public deposits: Deposit[] = [];

  private white: TSpriteComponent;

  public constructor(private engine: TEngine, private state: NectarSearch) {
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

    this.generateGarden();

    this.white = new TSpriteComponent(
      engine,
      this,
      128 * howmanygrass,
      128 * howmanygrass,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_4
    );
    this.white.instanceUVScales = [howmanygrass, howmanygrass];
    this.white.colorFilter = vec4.fromValues(0, 0, 0.1, 0.8);
    this.white.applyTexture(engine, whiteTexture);

    const apiaryTop = new TSpriteComponent(
      engine,
      this,
      128,
      128,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_1
    );
    apiaryTop.applyTexture(engine, apiaryTopTexture);
  }

  public async onUpdate(): Promise<void> {
    const startFade = 0.3;
    const endFade = 0.5;
    if (this.state.time > startFade) {
      this.white.shouldRender = true;

      const t = (this.state.time - startFade) / (endFade - startFade);
      this.white.colorFilter = vec4.fromValues(0, 0, 0.1, 0.8 * t);
    } else {
      this.white.colorFilter = vec4.fromValues(0, 0, 0.1, 0);
      this.white.shouldRender = false;
    }
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

  private generateGarden() {
    const noise = new Noise(2);

    for (let x = -gardenSize / 200; x < gardenSize / 200; x++) {
      for (let y = -gardenSize / 200; y < gardenSize / 200; y++) {
        const value = noise.simplex2(x, y);

        if (value > 0.9) {
          const t = new TSpriteComponent(
            this.engine,
            this,
            256,
            256,
            TOriginPoint.Center,
            TSpriteLayer.Background_1
          );
          t.transform.translation = vec3.fromValues(x * 100, y * 100, 0);

          // Randomly rotate the tree
          const rotation = Math.random() * Math.PI * 2;
          t.transform.rotation = quat.fromEuler(
            quat.create(),
            0,
            0,
            (rotation * 180) / Math.PI
          );

          t.applyTexture(this.engine, treeTexture);
        } else if (value > 0.8) {
          const t = new TSpriteComponent(
            this.engine,
            this,
            128,
            48 * 2,
            TOriginPoint.Center,
            TSpriteLayer.Background_1
          );
          t.transform.translation = vec3.fromValues(x * 100, y * 100, 0);
          t.transform.rotation = quat.fromEuler(
            quat.create(),
            0,
            0,
            (Math.random() * Math.PI * 2 * 180) / Math.PI
          );
          t.applyTexture(this.engine, bushTexture);
        } else if (value > 0.75) {
          const t = new TSpriteComponent(
            this.engine,
            this,
            96,
            96,
            TOriginPoint.Center,
            TSpriteLayer.Background_1
          );
          t.transform.translation = vec3.fromValues(x * 100, y * 100, 0);
          t.applyTexture(this.engine, rockTexture);
        }
      }
    }
  }
}
