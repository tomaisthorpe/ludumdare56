import styled from "styled-components";
import config from "./game/config";
import { useEventQueue } from "@tedengine/ted";
const maxRate = 5;

const Container = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const Box = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${config.palette.persianOrange}55;
  border: 1px solid ${config.palette.onyx}22;
  border-radius: 3px;

  &.active {
    background-color: ${config.palette.darkOrange}dd;
  }
`;

const Button = styled.div`
  background-color: ${config.palette.persianOrange}55;
  border: 1px solid ${config.palette.onyx}22;
  border-radius: 3px;
  height: 15px;
  padding: 2px 4px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${config.palette.persianOrange}88;
  }
`;

export default function LayingRate({ rate }: { rate: number }) {
  const events = useEventQueue();

  const onClick: (rate: number) => void = (rate) => {
    events?.broadcast({
      type: "CHANGE_LAYING_RATE",
      payload: { rate },
    });
  };

  return (
    <Container>
      <Button onClick={() => onClick(rate - 1)}>-</Button>
      {Array.from({ length: maxRate }).map((_, index) => (
        <Box key={index} className={index < rate ? "active" : ""} />
      ))}
      <Button onClick={() => onClick(rate + 1)}>+</Button>
    </Container>
  );
}
