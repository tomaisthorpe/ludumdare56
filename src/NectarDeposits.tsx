import { useEventQueue, useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";
import { NectarDeposit } from "./game/colony";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  width: 50%;
  text-align: left;
`;

const Deposits = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const Deposit = styled.div`
  background-color: ${config.palette.earthYellow};
  padding: 5px 10px;
  border: 2px solid ${config.palette.persianOrange};
  border-radius: 5px;
  max-width: 200px;
`;

const DepositLabel = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: ${config.palette.blue};
  text-shadow: none;
`;

const DepositTimeLeft = styled.div`
  font-size: 14px;
  color: ${config.palette.onyx};
`;

const GoSearchButton = styled.button`
  background-color: ${config.palette.blue};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 10px;
`;

const Notice = styled.div`
  font-size: 14px;
  color: ${config.palette.blue};
  margin-top: 10px;
  font-size: 1em;
`;

const DepositBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: transparent;
  border: 2px solid ${config.palette.blue};
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 2px;
  margin-bottom: 5px;
`;

const DepositBarFill = styled.div`
  height: 100%;
  background-color: ${config.palette.blue};
`;

const DepositBarText = styled.div`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const UnderutilizedNotice = styled.div`
  font-size: 12px;
  color: ${config.palette.onyx};
  margin-top: 5px;
  font-style: italic;
`;

export default function NectarDeposits() {
  const { nectarDeposits, state, isRaining } = useGameContext();
  const events = useEventQueue();
  if (!nectarDeposits) return null;
  if (state !== "game") return null;
  const onClick = () => {
    events?.broadcast({
      type: "GO_SEARCH_FOR_NECTAR",
    });
  };

  const depositsAvailable = nectarDeposits.filter(
    (deposit: NectarDeposit) =>
      deposit.status === "available" && !deposit.harvesting
  );

  const isUnderutilized = (deposit: NectarDeposit) => {
    return (
      deposit.harvesting && (deposit.lastHarvest ?? 0) < deposit.potential * 0.9
    );
  };

  return (
    <Container>
      <Deposits>
        {nectarDeposits
          .filter((deposit: NectarDeposit) => deposit.status === "available")
          .map((deposit: NectarDeposit) => (
            <Deposit key={deposit.id}>
              <DepositLabel>{deposit.name}</DepositLabel>
              {deposit.harvesting && (
                <>
                  <div>Harvesting</div>
                  <DepositBarContainer>
                    <DepositBarFill
                      style={{
                        width: `${Math.min(
                          ((deposit.lastHarvest ?? 0) / deposit.potential) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                    <DepositBarText>
                      {deposit.lastHarvest?.toFixed(0) ?? 0} /{" "}
                      {deposit.potential}
                    </DepositBarText>
                  </DepositBarContainer>
                  {isUnderutilized(deposit) && (
                    <UnderutilizedNotice>
                      This deposit isn't being fully utilized. Consider breeding
                      more bees!
                    </UnderutilizedNotice>
                  )}
                </>
              )}
              {!deposit.harvesting && (
                <>
                  <div>Nectar is available!</div>
                  <div>Go find it!</div>
                </>
              )}
              <DepositTimeLeft>⌛ {deposit.timeLeft} days left</DepositTimeLeft>
            </Deposit>
          ))}
      </Deposits>
      {depositsAvailable.length > 0 && (
        <>
          {isRaining ? (
            <Notice>It's raining, you can't go out</Notice>
          ) : (
            <GoSearchButton onClick={onClick}>Search for Nectar</GoSearchButton>
          )}
        </>
      )}
    </Container>
  );
}
