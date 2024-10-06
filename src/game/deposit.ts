import {
  TActor,
  TEngine,
  TOriginPoint,
  TSpriteLayer,
  TSpriteComponent,
  TResourcePackConfig,
  TTextureFilter,
  TBoxCollider,
  TSceneComponent,
} from "@tedengine/ted";
import depositTexture from "../assets/flower.png";
import hereBeNectarTexture from "../assets/here-be-nectar.png";
import hawthornTexture from "../assets/hawthorn.png";
import hawthornFlowerTexture from "../assets/hawthorn-flowers.png";
import blackberryFlowerTexture from "../assets/blackberries.png";
import heatherTexture from "../assets/heather.png";
import heatherFlowerTexture from "../assets/heather-flower.png";
import cloverTexture from "../assets/clover.png";
import cloverFlowerTexture from "../assets/clover-flowers.png";
import fruitTreeTexture from "../assets/fruit-tree.png";
import fruitTreeFlowerTexture from "../assets/fruit-tree-flowers.png";

import { vec3 } from "gl-matrix";
import { NectarDeposit } from "./colony";

export default class Deposit extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: depositTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: hereBeNectarTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: hawthornTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: hawthornFlowerTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: blackberryFlowerTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: heatherTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: heatherFlowerTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: cloverTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: cloverFlowerTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: fruitTreeTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
      {
        url: fruitTreeFlowerTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  public marker?: TSpriteComponent;
  public flowers?: TSpriteComponent;

  public constructor(
    private engine: TEngine,
    x: number,
    y: number,
    public info: NectarDeposit
  ) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 0,
      fixedRotation: true,
      isTrigger: true,
    });
    this.rootComponent.collider = new TBoxCollider(192, 128, 128, "Deposit");

    if (info.name === "Hawthorn") {
      const sprite = new TSpriteComponent(
        engine,
        this,
        192,
        192,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      sprite.applyTexture(engine, hawthornTexture);

      this.flowers = new TSpriteComponent(
        engine,
        this,
        192,
        192,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      this.flowers.applyTexture(engine, hawthornFlowerTexture);
      this.flowers.shouldRender = false;
    } else if (info.name === "Blackberry") {
      const sprite = new TSpriteComponent(
        engine,
        this,
        192,
        192,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      sprite.applyTexture(engine, hawthornTexture);

      this.flowers = new TSpriteComponent(
        engine,
        this,
        192,
        192,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      this.flowers.applyTexture(engine, blackberryFlowerTexture);
      this.flowers.shouldRender = false;
    } else if (info.name === "Heather") {
      const sprite = new TSpriteComponent(
        engine,
        this,
        256,
        192,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      sprite.applyTexture(engine, heatherTexture);

      this.flowers = new TSpriteComponent(
        engine,
        this,
        256,
        192,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      this.flowers.applyTexture(engine, heatherFlowerTexture);
      this.flowers.shouldRender = false;
    } else if (info.name === "Clover") {
      const sprite = new TSpriteComponent(
        engine,
        this,
        192,
        128,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      sprite.applyTexture(engine, cloverTexture);

      this.flowers = new TSpriteComponent(
        engine,
        this,
        192,
        128,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      this.flowers.applyTexture(engine, cloverFlowerTexture);
      this.flowers.shouldRender = false;
    } else if (info.name === "Fruit Trees") {
      const sprite = new TSpriteComponent(
        engine,
        this,
        256,
        256,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      sprite.applyTexture(engine, fruitTreeTexture);

      this.flowers = new TSpriteComponent(
        engine,
        this,
        256,
        256,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      this.flowers.applyTexture(engine, fruitTreeFlowerTexture);
      this.flowers.shouldRender = false;
    } else {
      const sprite = new TSpriteComponent(
        engine,
        this,
        192,
        128,
        TOriginPoint.Center,
        TSpriteLayer.Midground_0
      );
      sprite.applyTexture(engine, depositTexture);
    }
    this.updateInfo(info);

    this.rootComponent.transform.translation = vec3.fromValues(x, y, 0);
  }

  public updateInfo(info: NectarDeposit) {
    this.info = info;

    if (this.marker) {
      this.marker.shouldRender = false;
      this.marker.destroy();
    }

    if (this.flowers) {
      if (info.status === "available") {
        this.flowers.shouldRender = true;
      } else {
        this.flowers.shouldRender = false;
      }
    }

    if (info.status === "available" && !info.harvesting) {
      this.marker = new TSpriteComponent(
        this.engine,
        this,
        16,
        33,
        TOriginPoint.Center,
        TSpriteLayer.Midground_1
      );
      this.marker.applyTexture(this.engine, hereBeNectarTexture);
    }
  }
}
