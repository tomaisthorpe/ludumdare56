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

const Bee = styled.img`
  display: block;
  width: 64px;
  height: 40px;
  image-rendering: pixelated;
  transform: rotate(180deg);
  margin-top: 20px;
`;

export default function GameOver() {
  const { state, success, reason, honeyReserves } = useGameContext();
  if (!state || state != "gameOver" || success === undefined || !reason) {
    return null;
  }

  return (
    <Container>
      <Title>{success ? "You Win!" : "Game Over"}</Title>
      <Subtitle>
        {reason}
        {success && (
          <>
            <br />
            <br />
            You gathered {numberWithCommas(honeyReserves.toFixed(0))}g of honey.
          </>
        )}
        <br />
        <br />
        Refresh to try again.
      </Subtitle>
      {!success && <Bee src="/bee.png" />}
    </Container>
  );
}

const numberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
