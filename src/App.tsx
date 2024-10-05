import "./App.css";

import { TGame } from "@tedengine/ted";
import game from "./game/game?worker";
import { ColonyStats } from "./ColonyStats";
import NectarDeposits from "./NectarDeposits";
import GameOver from "./GameOver";
import DepositTimeline from "./DepositTimeline";
import SearchClock from "./SearchClock";
import Notice from "./Notice";

function App() {
  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <TGame
          width="100%"
          height="100%"
          config={{
            renderWidth: 800,
            renderHeight: 600,
            imageRendering: "pixelated",
            showFullscreenToggle: false,
            showAudioToggle: false,
          }}
          game={new game()}
        >
          <Notice />
          <GameOver />
          <ColonyStats />
          {/* <Clock /> */}
          <NectarDeposits />
          <DepositTimeline />
          <SearchClock />
        </TGame>
      </div>
    </>
  );
}

export default App;
