import { useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const BarContainer = styled.div`
  width: 200px;
  border: 4px solid ${config.palette.persianOrange};
  margin-bottom: 10px;
  margin-left: 10px;
  border-radius: 10px;
  padding: 2px;
`;

const BarContent = styled.div`
  background: ${config.palette.earthYellow}55;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  background-color: ${config.palette.persianOrange};
  position: absolute;
  top: 0;
  left: 0;
`;

const BarText = styled.div`
  width: 100%;
  color: white;
  mix-blend-mode: hard-light;
  font-weight: 900;
  font-size: 28px;
  padding: 3px 0;
`;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const numOfDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const percentOfMonthPassed = (date: Date) => {
  const daysInMonth = numOfDaysInMonth[date.getMonth()];
  const daysPassed = date.getDate();
  return (daysPassed / daysInMonth) * 100;
};

export default function Clock() {
  const { date, state } = useGameContext();

  if (state !== "game") return null;
  if (!date) return null;

  return (
    <Container>
      <BarContainer>
        <BarContent>
          <Bar
            style={{
              width: `${percentOfMonthPassed(date)}%`,
              transition: `width ${
                date.getDate() === 1 ? 0 : config.timePerDay
              }s linear`,
            }}
          />
          <BarText>{monthNames[date.getMonth()]}</BarText>
        </BarContent>
      </BarContainer>
    </Container>
  );
}
