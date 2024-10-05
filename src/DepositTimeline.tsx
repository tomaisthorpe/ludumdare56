import { useGameContext } from "@tedengine/ted";
import styled from "styled-components";
import config from "./game/config";
import { NectarDeposit } from "./game/colony";
import { useState } from "react";

const monthWidth = 200;
const Container = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 50%;
  padding: 10px;
  overflow: hidden;
`;

const Timeline = styled.div`
  height: 80px;
  background-color: ${config.palette.earthYellow}55;
  border: 2px solid ${config.palette.persianOrange};
  border-radius: 5px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const MonthsContainer = styled.div<{ left: number }>`
  display: flex;
  position: absolute;
  left: ${(props) => props.left}px;
  transition: left 1s linear;
`;

const Month = styled.div`
  flex: 0 0 ${monthWidth}px;
  border-right: 1px solid ${config.palette.persianOrange};
  width: ${monthWidth}px;
  height: 50px;
  align-items: flex-start;
  justify-content: center;
`;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DepositBar = styled.div<{ left: number; width: number; row: number }>`
  position: absolute;
  height: 10px;
  background-color: ${config.palette.blue};
  top: ${(props) => 20 + props.row * 12}px;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  border-radius: 3px;
  cursor: pointer;
`;

const Tooltip = styled.div<{ x: number; y: number }>`
  position: fixed;
  background-color: ${config.palette.persianOrange};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
`;

export default function DepositTimeline() {
  const { date, state, colony, nectarDeposits } = useGameContext();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
  } | null>(null);

  if (state !== "game" || !date || !colony || !nectarDeposits) return null;

  const currentMonth = date.getMonth();
  const currentDay = date.getDate();

  // Calculate the offset based on the current day of the month
  const dayOffset = ((currentDay - 1) / getDaysInMonth(date)) * monthWidth;

  const containerLeft = -(currentMonth * monthWidth + dayOffset);

  const calculateDepositPosition = (deposit: NectarDeposit) => {
    const currentYear = date.getFullYear();
    const startDate = new Date(
      currentYear,
      deposit.startMonth,
      deposit.startDay
    );
    const endDate = new Date(currentYear, deposit.endMonth, deposit.endDay);

    // Handle year wrap-around
    if (endDate < startDate) {
      endDate.setFullYear(currentYear + 1);
    }

    const startPosition =
      deposit.startMonth * monthWidth +
      (deposit.startDay / getDaysInMonth(startDate)) * monthWidth;
    const endPosition =
      deposit.endMonth * monthWidth +
      (deposit.endDay / getDaysInMonth(endDate)) * monthWidth;

    return {
      left: startPosition,
      width: endPosition - startPosition,
    };
  };

  const assignRows = (deposits: NectarDeposit[]) => {
    const sortedDeposits = [...deposits].sort((a, b) => {
      const aDate = new Date(2024, a.startMonth, a.startDay);
      const bDate = new Date(2024, b.startMonth, b.startDay);
      return aDate.getTime() - bDate.getTime();
    });
    const rows: { end: number; deposit: NectarDeposit }[][] = [];

    sortedDeposits.forEach((deposit) => {
      const { left, width } = calculateDepositPosition(deposit);
      const end = left + width;

      let rowIndex = rows.findIndex((row) => {
        return row.every((item) => item.end <= left);
      });

      if (rowIndex === -1) {
        rowIndex = rows.length;
        rows.push([]);
      }

      rows[rowIndex].push({ end, deposit });
    });

    return rows;
  };

  const depositRows = assignRows(nectarDeposits);

  return (
    <Container>
      <Timeline>
        <MonthsContainer left={containerLeft}>
          {monthNames.map((monthName, index) => (
            <Month key={index}>{monthName}</Month>
          ))}
          {depositRows.map((row, rowIndex) =>
            row.map(({ deposit }, index) => {
              const { left, width } = calculateDepositPosition(deposit);
              return (
                <DepositBar
                  key={`${rowIndex}-${index}`}
                  left={left}
                  width={width}
                  row={rowIndex}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      x: e.clientX,
                      y: rect.top - 30,
                      name: deposit.name,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          )}
        </MonthsContainer>
      </Timeline>
      {tooltip && (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          {tooltip.name}
        </Tooltip>
      )}
    </Container>
  );
}

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
