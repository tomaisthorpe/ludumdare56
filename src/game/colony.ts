import config from "./config";

interface BeeGroup {
  count: number;
  age: number;
}

export default class Colony {
  private brood: BeeGroup[] = [];
  private workerBees: BeeGroup[] = [];
  private _honeyReserves = config.colony.initialHoneyReserves;
  private starvationDays = 0;

  public layingRate = config.colony.initialLayingRate;

  constructor() {
    // Initialize with initial worker bees, all at age 0
    this.workerBees.push({ count: config.colony.initialWorkerBees, age: 0 });
  }

  public get numBees(): number {
    return this.workerBees.reduce((sum, group) => sum + group.count, 0);
  }

  public get numBrood(): number {
    return this.brood.reduce((sum, group) => sum + group.count, 0);
  }

  public get honeyReserves(): number {
    return this._honeyReserves;
  }

  public calculateHoneyConsumption(): number {
    return this.numBees * config.colony.honeyConsumptionPerBee;
  }

  public howLongWillHoneyLast(): number {
    return this.honeyReserves / this.calculateHoneyConsumption() || 0;
  }

  public step(): void {
    // Lay new eggs
    const newEggs = Math.floor(this.layingRate * config.colony.eggMultiplier);
    this.brood.unshift({ count: newEggs, age: 0 });

    // Age brood and hatch into worker bees
    this.brood = this.brood.map((group) => ({ ...group, age: group.age + 1 }));
    if (this.brood.length > 0 && this.brood[this.brood.length - 1].age >= 7) {
      const hatchedBees = this.brood.pop()!;
      this.workerBees.unshift({ count: hatchedBees.count, age: 0 });
    }

    // Age worker bees and remove those older than 6 weeks
    this.workerBees = this.workerBees
      .map((group) => ({ ...group, age: group.age + 1 }))
      .filter((group) => group.age <= 42); // 6 weeks * 7 days

    // Calculate honey consumption
    const honeyConsumption = this.calculateHoneyConsumption();

    // Check if there's enough honey
    if (this._honeyReserves < honeyConsumption) {
      this.starvationDays++;
      if (this.starvationDays > config.colony.starvationTolerance) {
        this.killBeesFromStarvation();
      }
    } else {
      this.starvationDays = 0;
    }

    // Consume honey (limited by available reserves)
    this._honeyReserves = Math.max(0, this._honeyReserves - honeyConsumption);
  }

  private killBeesFromStarvation(): void {
    const survivalRate = Math.max(
      0,
      1 -
        (this.starvationDays - config.colony.starvationTolerance) /
          config.colony.starvationTolerance
    );
    let beesToKill = Math.floor(this.numBees * (1 - survivalRate));

    // Start killing from the oldest bees
    for (let i = this.workerBees.length - 1; i >= 0 && beesToKill > 0; i--) {
      if (this.workerBees[i].count <= beesToKill) {
        beesToKill -= this.workerBees[i].count;
        this.workerBees[i].count = 0;
      } else {
        this.workerBees[i].count -= beesToKill;
        beesToKill = 0;
      }
    }

    // Remove any groups that have been completely killed
    this.workerBees = this.workerBees.filter((group) => group.count > 0);
  }
}
