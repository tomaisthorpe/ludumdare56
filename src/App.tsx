import "./App.css";

import { TGame } from "@tedengine/ted";
import game from "./game/game?worker";

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
        ></TGame>
      </div>
    </>
  );
}

export default App;
