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
  palette: {
    onyx: "#393d3f",
    blue: "#62929e",
    vanilla: "#dfd5a5",
    earthYellow: "#dbad6a",
    persianOrange: "#cb9152",
  },
  startingDay: 1,
  startingMonth: 3,
  timePerDay: 1,
  colony: {
    initialWorkerBees: 140,
    initialHoneyReserves: 100,
    initialLayingRate: 2,
    eggMultiplier: 8,
    honeyConsumptionPerBee: 0.05,
    starvationTolerance: 3,
    nectarHarvestPerBee: 0.2,
  },
  apiary: {
    spawnRatePerBee: 0.001,
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
        name: "Fruit Trees",
        potential: 80,
        startDay: 10,
        startMonth: 3,
        endDay: 30,
        endMonth: 5,
        status: "unavailable",
        x: -1000,
        y: 800,
      },
      {
        id: 2,
        name: "Clover",
        potential: 160,
        startDay: 10,
        startMonth: 6,
        endDay: 15,
        endMonth: 7,
        status: "unavailable",
        x: 1500,
        y: -800,
      },
      {
        id: 3,
        name: "Blackberry",
        potential: 200,
        startDay: 25,
        startMonth: 5,
        endDay: 15,
        endMonth: 8,
        status: "unavailable",
        x: 1500,
        y: 800,
      },
      {
        id: 4,
        name: "Heather",
        potential: 250,
        startDay: 25,
        startMonth: 7,
        endDay: 12,
        endMonth: 8,
        status: "unavailable",
        x: 1500,
        y: 800,
      },
    ] as NectarDeposit[],
  },
};

export default config;
