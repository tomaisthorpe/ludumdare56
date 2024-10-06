import { useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";
const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: white;
  z-index: 100;
`;

const Panel = styled.div`
  background-color: ${config.palette.earthYellow};
  border: 2px solid ${config.palette.persianOrange};
  border-radius: 10px;
  padding: 10px 20px;
  border-radius: 0.5rem;
`;
export default function Notice() {
  const { notice } = useGameContext();
  if (!notice) return null;

  return (
    <Container>
      <Panel>{notice}</Panel>
    </Container>
  );
}
