import React, { useState } from 'react';
import '../styles/GameUI.css';

const GameUI: React.FC = () => {
  const [health, setHealth] = useState<number>(100);
  const [money, setMoney] = useState<number>(0);
  const [enemiesRemaining, setEnemiesRemaining] = useState<number>(10);
  const [waveStarted, setWaveStarted] = useState<boolean>(false);

  const startWave = (): void => {
    setWaveStarted(true);
    const interval = setInterval(() => {
      setEnemiesRemaining(prev => {
        if (prev > 0) {
          setMoney(m => m + 10);
          return prev - 1;
        } else {
          clearInterval(interval);
          setWaveStarted(false);
          return 0;
        }
      });

      setHealth(h => (h > 0 ? h - 5 : 0));
    }, 1000);
  };

  return (
    <div className="game-ui">
      <div className="stats">
        <p>❤️ Vida: {health}</p>
        <p>💰 Dinero: ${money}</p>
        <p>👾 Enemigos restantes: {enemiesRemaining}</p>
      </div>
      <button onClick={startWave} disabled={waveStarted || enemiesRemaining === 0}>
        🚀 Iniciar Oleada
      </button>
    </div>
  );
};

export default GameUI;