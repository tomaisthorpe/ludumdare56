import config from "./config";

export default class Colony {
  // Not sure I care about drones and queens
  private numWorkerBees = config.colony.initialWorkerBees;

  // @todo what unit is this?
  private _honeyReserves = config.colony.initialHoneyReserves;

  public layingRate = config.colony.initialLayingRate;

  public get numBees(): number {
    return this.numWorkerBees;
  }

  public get honeyReserves(): number {
    return this._honeyReserves;
  }

  public calculateHoneyConsumption(): number {
    return this.numBees * config.colony.honeyConsumptionPerBee;
  }

  // @todo is this days/months?
  public howLongWillHoneyLast(): number {
    return this.honeyReserves / this.calculateHoneyConsumption();
  }
}
