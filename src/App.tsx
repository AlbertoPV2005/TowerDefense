import React, { useState } from "react";
import Map from "./components/Map";
import GameUI from "./components/GameUI";
import "./App.css";

const App: React.FC = () => {
  // Estado global del juego
  const [health, setHealth] = useState<number>(100);
  const [money, setMoney] = useState<number>(0);
  const [enemiesRemaining, setEnemiesRemaining] = useState<number>(0);
  const [waveStarted, setWaveStarted] = useState<boolean>(false);

  // Función para iniciar oleada
  const startWave = () => {
    setWaveStarted(true);
    setEnemiesRemaining(10); // por ejemplo, 10 enemigos en la oleada
  };

  // Cuando un enemigo muere
  const handleEnemyDeath = () => {
    setEnemiesRemaining((prev) => Math.max(prev - 1, 0));
    setMoney((prev) => prev + 10); // recompensa por enemigo
  };

  // Cuando un enemigo llega al final del camino
  const handleEnemyEscape = () => {
    setHealth((prev) => Math.max(prev - 5, 0));
  };

  return (
    <div className="game-container">
      <Map
        waveStarted={waveStarted}
        onEnemyDeath={handleEnemyDeath}
        onEnemyEscape={handleEnemyEscape}
      />
      <GameUI
        health={health}
        money={money}
        enemiesRemaining={enemiesRemaining}
        waveStarted={waveStarted}
        startWave={startWave}
      />
    </div>
  );
};

export default App;