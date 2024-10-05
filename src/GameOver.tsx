import { useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${config.palette.onyx};
  color: ${config.palette.vanilla};
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: ${config.palette.vanilla};
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${config.palette.vanilla};
`;

export default function GameOver() {
  const { state } = useGameContext();
  if (!state || state != "gameOver") {
    return null;
  }

  return (
    <Container>
      <Title>Game Over</Title>
      <Subtitle>
        You lost. Your bees are dead.
        <br />
        Refresh to try again.
      </Subtitle>
    </Container>
  );
}
