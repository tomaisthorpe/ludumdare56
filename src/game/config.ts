import { NectarDeposit } from "./colony";

const config = {
  palette: {
    onyx: "#393d3f",
    blue: "#62929e",
    vanilla: "#dfd5a5",
    earthYellow: "#dbad6a",
    persianOrange: "#cb9152",
  },
  startingDay: 1,
  startingMonth: 3,
  timePerDay: 0.5,
  colony: {
    initialWorkerBees: 140,
    initialHoneyReserves: 100,
    initialLayingRate: 2,
    eggMultiplier: 10,
    honeyConsumptionPerBee: 0.01,
    starvationTolerance: 3,
    nectarHarvestPerBee: 0.05,
  },
  apiary: {
    spawnRatePerBee: 0.001,
  },
  garden: {
    deposits: [
      {
        id: 0,
        name: "Blueberry",
        potential: 100,
        startDay: 1,
        startMonth: 3,
        endDay: 30,
        endMonth: 3,
        status: "unavailable",
        x: 400,
        y: 200,
      },
      {
        id: 1,
        name: "Cheeseberry",
        potential: 100,
        startDay: 5,
        startMonth: 3,
        endDay: 30,
        endMonth: 4,
        status: "unavailable",
        x: -600,
        y: 600,
      },
    ] as NectarDeposit[],
  },
};

export default config;
