import React, { useState, useCallback } from "react";
import Map from "./components/Map";
import GameUI from "./components/GameUI";
import "./App.css";

const App: React.FC = () => {
  const [health, setHealth] = useState(100);
  const [money, setMoney] = useState(0);
  const [enemiesRemaining, setEnemiesRemaining] = useState(0);
  const [waveStarted, setWaveStarted] = useState(false);

  const endWaveIfNeeded = useCallback((remaining: number) => {
    if (remaining <= 0) {
      setWaveStarted(false);
    }
  }, []);

  const startWave = () => {
    if (!waveStarted) {
      setWaveStarted(true);
      setEnemiesRemaining(10);
    }
  };

  const handleEnemyDeath = () => {
    setEnemiesRemaining(prev => {
      const updated = Math.max(prev - 1, 0);
      endWaveIfNeeded(updated);
      return updated;
    });
    setMoney(prev => prev + 10);
  };

  const handleEnemyEscape = () => {
    setHealth(prev => Math.max(prev - 5, 0));
    setEnemiesRemaining(prev => {
      const updated = Math.max(prev - 1, 0);
      endWaveIfNeeded(updated);
      return updated;
    });
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