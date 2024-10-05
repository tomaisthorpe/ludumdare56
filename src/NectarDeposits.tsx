import { useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";
import { NectarDeposit } from "./game/colony";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  width: 50%;
`;

const Deposit = styled.div`
  background-color: ${config.palette.earthYellow};
  padding: 5px 10px;
  border: 2px solid ${config.palette.persianOrange};
  border-radius: 5px;
`;

const DepositLabel = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: ${config.palette.blue};
`;

const DepositTimeLeft = styled.div`
  font-size: 14px;
  color: ${config.palette.onyx};
`;

export default function NectarDeposits() {
  const { nectarDeposits } = useGameContext();
  if (!nectarDeposits) return null;

  return (
    <Container>
      {nectarDeposits.map((deposit: NectarDeposit) => (
        <Deposit key={deposit.id}>
          <DepositLabel>Wildflowers</DepositLabel>
          <div>
            Harvesting {deposit.lastHarvest.toFixed(0)} / {deposit.potential}
          </div>
          <DepositTimeLeft>⌛ {deposit.timeLeft} days left</DepositTimeLeft>
        </Deposit>
      ))}
    </Container>
  );
}
