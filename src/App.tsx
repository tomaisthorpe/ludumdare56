import "./App.css";

import { TGame } from "@tedengine/ted";
import game from "./game/game?worker";
import { ColonyStats } from "./ColonyStats";
import Clock from "./Clock";
import NectarDeposits from "./NectarDeposits";

function App() {
  return (
    <>
      <div>
        <TGame
          config={{
            renderWidth: 800,
            renderHeight: 600,
            imageRendering: "pixelated",
            showAudioToggle: true,
          }}
          game={new game()}
        >
          <ColonyStats />
          <Clock />
          <NectarDeposits />
        </TGame>
      </div>
    </>
  );
}

export default App;
