import styled from "styled-components";
import { useGameContext } from "@tedengine/ted";
import config from "./game/config";
import LayingRate from "./LayingRate";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
  text-align: left;
  padding: 15px 10px;
`;

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  font-size: 22px;
  border: 2px solid ${config.palette.persianOrange};
  background-color: ${config.palette.earthYellow}cc;
  border-radius: 10px;
  padding: 5px 10px;
`;

const GroupLabel = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: ${config.palette.onyx};
  margin-top: 20px;
`;

const Stat = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export function ColonyStats() {
  const { colony, state } = useGameContext();

  if (state !== "game") return null;
  if (!colony) return null;
  return (
    <Container>
      <GroupLabel>Colony</GroupLabel>
      <Group>
        <Stat>Bees: {colony.numBees}</Stat>
        <Stat>Brood: {colony.numBrood}</Stat>
        <Stat>
          Laying: <LayingRate rate={colony.layingRate} />
        </Stat>
      </Group>

      <GroupLabel>Honey</GroupLabel>
      <Group>
        <div>Honey: {colony.honeyReserves.toFixed(0)}</div>
        <div>Honey Consumption: {colony.honeyConsumption.toFixed(1)}</div>
        <div>Honey Production: {colony.honeyProduction.toFixed(1)}</div>
        <div>
          How Long Will Honey Last: {colony.howLongWillHoneyLast.toFixed(0)}
        </div>
      </Group>
    </Container>
  );
}
