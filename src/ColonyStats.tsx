import styled from "styled-components";
import { useGameContext } from "@tedengine/ted";
const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-family: monospace;
  text-align: left;
  padding: 15px 10px;
`;

export function ColonyStats() {
  const { colony } = useGameContext();

  if (!colony) return null;
  return (
    <Container>
      <div>Bees: {colony.numBees}</div>
      <div>Honey: {colony.honeyReserves}</div>
      <div>Honey Consumption: {colony.honeyConsumption.toFixed(1)}</div>
      <div>
        How Long Will Honey Last: {colony.howLongWillHoneyLast.toFixed(0)}
      </div>
    </Container>
  );
}
