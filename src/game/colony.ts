import config from "./config";

interface BeeGroup {
  count: number;
  age: number;
}

export interface NectarDeposit {
  id: number;
  name: string;

  // This is the maximum amount of nectar that can be collected from the deposit
  potential: number;

  // When does the nectar start to be available
  startDay: number;
  startMonth: number;

  // When does the nectar stop being available
  endDay: number;
  endMonth: number;

  status: "unavailable" | "available";
  harvesting?: boolean;

  // For UI only
  lastHarvest?: number;

  // Time left in days
  timeLeft?: number;

  // Position for use in nectar search
  x: number;
  y: number;
}

export default class Colony {
  private brood: BeeGroup[] = [];
  private workerBees: BeeGroup[] = [];
  private _honeyReserves = config.colony.initialHoneyReserves;
  private starvationDays = 0;

  public layingRate = config.colony.initialLayingRate;

  public nectarDeposits: NectarDeposit[] = config.garden.deposits;

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

  public isRaining(date: Date): boolean {
    return config.events.some((event) => {
      const startDate = new Date(
        date.getFullYear(),
        event.startMonth,
        event.startDay
      );
      const endDate = new Date(
        date.getFullYear(),
        event.endMonth,
        event.endDay
      );
      return date >= startDate && date <= endDate;
    });
  }

  public get honeyReserves(): number {
    return this._honeyReserves;
  }

  public calculateHoneyConsumption(): number {
    return this.numBees * config.colony.honeyConsumptionPerBee;
  }

  // Returns the number of days the current honey reserves will last
  // This ignores production.
  public howLongWillHoneyLast(): number {
    return this.honeyReserves / this.calculateHoneyConsumption() || 0;
  }

  public step(currentDate: Date): void {
    // Lay new eggs, if there are bees
    if (this.numBees > 0) {
      const newEggs = Math.floor(this.layingRate * config.colony.eggMultiplier);
      this.brood.unshift({ count: newEggs, age: 0 });
    }

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

    // Ensure nectar deposits are available/unavailable depending on the dates
    this.nectarDeposits.forEach((deposit) => {
      const startDate = new Date(
        currentDate.getFullYear(),
        deposit.startMonth,
        deposit.startDay
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        deposit.endMonth,
        deposit.endDay
      );

      if (currentDate >= startDate && currentDate <= endDate) {
        deposit.status = "available";
      } else {
        deposit.status = "unavailable";
      }

      deposit.timeLeft = Math.ceil(
        (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    });

    // Harvest nectar from deposits
    this._honeyReserves += this.calculateHoneyProduction(currentDate);

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

  public calculateHoneyProduction(date: Date): number {
    if (this.isRaining(date)) {
      return 0;
    }

    // Maximum amount of nectar that can be harvested from the deposits
    const maxNectarHarvest = this.nectarDeposits.reduce(
      (sum, deposit) =>
        sum +
        (deposit.status === "available" && deposit.harvesting
          ? deposit.potential
          : 0),
      0
    );

    if (maxNectarHarvest === 0) {
      return 0;
    }

    // Amount of nectar that can be harvested from the worker bees
    const nectarHarvested = Math.min(
      this.workerBees.reduce(
        (sum, group) => sum + group.count * config.colony.nectarHarvestPerBee,
        0
      ),
      maxNectarHarvest
    );

    // Proportion of the potential that was harvested
    const harvestProportion = nectarHarvested / maxNectarHarvest;

    // Add the last harvest amount to each nectar deposit
    // This will be displayed in the UI
    this.nectarDeposits.forEach((deposit) => {
      deposit.lastHarvest = deposit.potential * harvestProportion;
    });

    return nectarHarvested;
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
