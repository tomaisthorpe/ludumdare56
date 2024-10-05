import styled from "styled-components";
import config from "./game/config";
import { useGameContext } from "@tedengine/ted";
const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
`;

const DialContainer = styled.div`
  width: 256px;
  height: 128px;
  overflow: hidden;
  border-bottom: 8px solid ${config.palette.onyx};
  border-radius: 10px;
`;

const Dial = styled.div<{ time: number }>`
  width: 256px;
  height: 256px;
  transform: rotate(${(props) => props.time * 360}deg);
  transform-origin: center center;
`;

const DialImage = styled.img`
  image-rendering: pixelated;
`;

export default function SearchClock() {
  const { time, state } = useGameContext();
  if (state !== "nectarSearch") return null;

  return (
    <Container>
      <DialContainer>
        <Dial time={time}>
          <DialImage src="/clock.png" width="256" height="256" />
        </Dial>
      </DialContainer>
    </Container>
  );
}
