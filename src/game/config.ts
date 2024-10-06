import { NectarDeposit } from "./colony";

export type Event = {
  type: "rain";
  name: string;
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
};

const config = {
  successThreshold: 6 * 30,
  endMonth: 9,
  palette: {
    onyx: "#393d3f",
    blue: "#62929e",
    vanilla: "#dfd5a5",
    earthYellow: "#dbad6a",
    persianOrange: "#cb9152",
    darkOrange: "#92602c",
  },
  startingDay: 1,
  startingMonth: 3,
  timePerDay: 1,
  colony: {
    initialWorkerBees: 1400,
    initialHoneyReserves: 1500,
    initialLayingRate: 20,
    eggMultiplier: 20,
    honeyConsumptionPerBee: 0.05,
    starvationTolerance: 3,
    nectarHarvestPerBee: 0.4,
  },
  apiary: {
    spawnRatePerBee: 0.00005,
  },
  events: [
    {
      type: "rain",
      name: "Rain",
      startDay: 10,
      startMonth: 3,
      endDay: 15,
      endMonth: 3,
    },
    {
      type: "rain",
      name: "Rain",
      startDay: 20,
      startMonth: 4,
      endDay: 5,
      endMonth: 5,
    },
    {
      type: "rain",
      name: "Rain",
      startDay: 5,
      startMonth: 6,
      endDay: 15,
      endMonth: 6,
    },
    {
      type: "rain",
      name: "Rain",
      startDay: 12,
      startMonth: 7,
      endDay: 18,
      endMonth: 7,
    },
  ] as Event[],
  garden: {
    // Roughly based on:
    // - https://talkingwithbees.com/beekeeping-how-to-guides/harvesting-honey#:~:text=How%2DTo%20Harvest%20Honey%20*%20First%20nectar%20flow:,Heather%20Honey%20nectar%20flow:%20August%20&%20September.

    deposits: [
      {
        id: 0,
        name: "Hawthorn",
        potential: 1000,
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
        name: "Fruit Trees",
        potential: 800,
        startDay: 10,
        startMonth: 3,
        endDay: 30,
        endMonth: 5,
        status: "unavailable",
        x: -1000,
        y: 20,
      },
      {
        id: 2,
        name: "Clover",
        potential: 1600,
        startDay: 10,
        startMonth: 6,
        endDay: 15,
        endMonth: 7,
        status: "unavailable",
        x: 1120,
        y: -700,
      },
      {
        id: 3,
        name: "Blackberry",
        potential: 2000,
        startDay: 25,
        startMonth: 5,
        endDay: 15,
        endMonth: 8,
        status: "unavailable",
        x: -250,
        y: 800,
      },
      {
        id: 4,
        name: "Heather",
        potential: 2500,
        startDay: 25,
        startMonth: 5,
        endDay: 12,
        endMonth: 8,
        status: "unavailable",
        x: 200,
        y: -800,
      },
    ] as NectarDeposit[],
  },
};

export default config;
