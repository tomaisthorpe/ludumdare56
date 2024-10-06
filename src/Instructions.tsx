import styled from "styled-components";
import config from "./game/config";
import { useEventQueue, useGameContext } from "@tedengine/ted";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
`;

const Content = styled.div`
  margin: auto;
  max-width: 60%;
  padding: 20px;
  border: 2px solid ${config.palette.persianOrange};
  background-color: ${config.palette.earthYellow};
  color: ${config.palette.onyx};
  border-radius: 10px;

  li {
    list-style-type: none;
  }
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 5px;
  padding-bottom: 0px;
  margin-top: 5px;
`;

const Button = styled.button`
  background-color: ${config.palette.blue};
  color: ${config.palette.vanilla};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
`;

export default function Instructions() {
  const events = useEventQueue();
  const { state } = useGameContext();

  if (state !== "instructions") {
    return null;
  }

  const onStart = () => {
    events?.broadcast({
      type: "START_GAME",
    });
  };

  return (
    <Container>
      <Content>
        <Heading>Instructions</Heading>
        <p>
          Your bees are searching for nectar to feed their colony. You need to
          build up enough reserves to last the winter.
        </p>
        <p>
          When sources of nectar become available you will need to scout them
          out to help your bees find them.
        </p>
        <p>
          Make sure you have enough bees to harvest the nectar by adjusting the
          laying rate. Bees only live for 6 weeks, so you can reduce your hive
          by lowing your laying rate and waiting.
        </p>
        <p>
          You win when you have enough honey reserves to last the winter. <br />
          You lose when your bees die of starvation.
        </p>
        <h2>Controls</h2>
        <ul>
          <li>
            <strong>Arrow Keys / WASD</strong> - Move the bee
          </li>
          <li>
            <strong>Space</strong> - Harvest nectar (when hovering over a
            flower)
          </li>
          <li>All other controls are with the mouse.</li>
        </ul>
        <Button onClick={onStart}>Start</Button>
      </Content>
    </Container>
  );
}
