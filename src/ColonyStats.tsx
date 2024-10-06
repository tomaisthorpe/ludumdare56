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
  width: 330px;
  font-size: 20px;
  border: 2px solid ${config.palette.persianOrange};
  background-color: ${config.palette.earthYellow}cc;
  border-radius: 10px;
  padding: 5px 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const GroupLabel = styled.div<{ isRaining: boolean }>`
  font-weight: bold;
  font-size: 24px;
  color: ${(props) =>
    props.isRaining ? config.palette.vanilla : config.palette.onyx};
  margin-top: 20px;
`;

const Stat = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HoneyBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: transparent;
  border: 2px solid ${config.palette.blue};
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

const HoneyBarFill = styled.div`
  height: 100%;
  background-color: ${config.palette.blue};
  transition: width 0.5s linear;
`;

const HoneyText = styled.div`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const Label = styled.span`
  font-weight: bold;
  color: ${config.palette.onyx}cc;
  text-shadow: none;
`;

const Note = styled.div`
  font-size: 12px;
  color: ${config.palette.onyx}cc;
`;

const Info = styled.div`
  font-size: 16px;
  text-shadow: none;
`;

const HoneyAmount = styled.span`
  color: ${config.palette.darkOrange};
  font-weight: bold;
  text-shadow: none;
`;

export function ColonyStats() {
  const { colony, state, isRaining } = useGameContext();

  if (state !== "game") return null;
  if (!colony) return null;
  return (
    <Container>
      <GroupLabel isRaining={isRaining}>Honey</GroupLabel>
      <Group>
        <HoneyBarContainer>
          <HoneyBarFill
            style={{
              width: `${Math.min(
                (colony.honeyReserves /
                  colony.honeyConsumption /
                  config.successThreshold) *
                  100,
                100
              )}%`,
            }}
          />
          <HoneyText>{colony.honeyReserves.toFixed(0)}g</HoneyText>
        </HoneyBarContainer>
        <div>
          <Label>Consumption:</Label> {colony.honeyConsumption.toFixed(0)}g per
          day
        </div>
        <div>
          <Label>Production:</Label> {colony.honeyProduction.toFixed(0)}g per
          day
        </div>
        <div>
          <Label>Reserves:</Label> {colony.howLongWillHoneyLast.toFixed(0)} days
          <Note>(based on current consumption and production)</Note>
        </div>
        <Info>
          You need {config.successThreshold} days of honey to last the winter.
          That's{" "}
          <HoneyAmount>
            {(config.successThreshold * colony.honeyConsumption).toFixed(0)}g
          </HoneyAmount>{" "}
          of honey as your current colony size.
        </Info>
      </Group>
      <GroupLabel isRaining={isRaining}>Colony</GroupLabel>
      <Group>
        <Stat>
          <Label>Bees:</Label> {colony.numBees}
        </Stat>
        <Stat>
          <Label>Brood:</Label> {colony.numBrood}
        </Stat>
        <Stat>
          <Label>Laying:</Label> <LayingRate rate={colony.layingRate} />
        </Stat>
      </Group>
    </Container>
  );
}
