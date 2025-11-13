import React from "react";
import "../styles/GameUI.css";

type GameUIProps = {
  health: number;
  money: number;
  enemiesRemaining: number;
  waveStarted: boolean;
  startWave: () => void;
};

const GameUI: React.FC<GameUIProps> = ({
  health,
  money,
  enemiesRemaining,
  waveStarted,
  startWave,
}) => {
  return (
    <div className="game-ui">
      <div className="stats">
        <p>❤️ Vida: {health}</p>
        <p>💰 Dinero: ${money}</p>
        <p>👾 Enemigos restantes: {enemiesRemaining}</p>
      </div>
      <button onClick={startWave} disabled={waveStarted || enemiesRemaining > 0}>
        🚀 Iniciar Oleada
      </button>
    </div>
  );
};

export default GameUI;