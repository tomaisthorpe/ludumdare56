import { useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";
const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
`;

const DepositInfo = styled.div`
  padding: 10px 20px;
  background-color: ${config.palette.earthYellow};
  border: 2px solid ${config.palette.persianOrange};
  border-radius: 10px;
`;

const DepositName = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${config.palette.blue};
`;

const DepositStatus = styled.div`
  font-size: 16px;
  color: ${config.palette.onyx};
`;

export default function DepositInformation() {
  const { state, overDeposit } = useGameContext();
  if (!overDeposit || state != "nectarSearch") {
    return null;
  }

  return (
    <Container>
      <DepositInfo>
        <DepositName>{overDeposit.name}</DepositName>
        {overDeposit.status == "available" ? (
          <>
            {overDeposit.harvesting ? (
              <DepositStatus>
                You are already harvesting this flower.
              </DepositStatus>
            ) : (
              <DepositStatus>Available! Press Space to harvest</DepositStatus>
            )}
          </>
        ) : (
          <DepositStatus>Unavailable</DepositStatus>
        )}
      </DepositInfo>
    </Container>
  );
}
