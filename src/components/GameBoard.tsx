import React, { useState, useEffect, useRef } from "react";
import Map from "./Map";
import Tower from "./Tower";
import Enemy from "./Enemy";
import GameUI from "./GameUI";
import { generatePath, mapLayout } from "../utils/MapUtils";
import type { CellType } from "../types";

const { pathCoords } = generatePath();

const GameBoard: React.FC = () => {
  const [towers, setTowers] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<
    { id: number; x: number; y: number; hp: number; pathIndex: number }[]
  >([]);
  const [waveStarted, setWaveStarted] = useState(false);
  const [health, setHealth] = useState(100);
  const [money, setMoney] = useState(0);
  const [enemiesRemaining, setEnemiesRemaining] = useState(0);

  const enemiesRef = useRef<typeof enemies>([]);
  enemiesRef.current = enemies;

  const startWave = () => {
    if (!waveStarted) {
      setWaveStarted(true);
      setEnemies([]);
      setEnemiesRemaining(10);
      let count = 0;
      const spawnInterval = setInterval(() => {
        if (count < 10) {
          const newEnemy = {
            id: count + 1,
            x: pathCoords[0][0],
            y: pathCoords[0][1],
            hp: 50,
            pathIndex: 0
          };
          enemiesRef.current = [...enemiesRef.current, newEnemy];
          setEnemies([...enemiesRef.current]);
          count++;
        } else {
          clearInterval(spawnInterval);
        }
      }, 1500);
    }
  };

  useEffect(() => {
    if (!waveStarted) return;
    let animationFrame: number;
    const speed = 0.15;

    const animate = () => {
      const updated: typeof enemiesRef.current = [];

      for (const enemy of enemiesRef.current) {
        const targetIndex = enemy.pathIndex + 1;
        if (targetIndex >= pathCoords.length) {
          setHealth(prev => Math.max(prev - 5, 0));
          setEnemiesRemaining(prev => {
            const next = Math.max(prev - 1, 0);
            if (next === 0) setWaveStarted(false);
            return next;
          });
          continue;
        }

        const [tx, ty] = pathCoords[targetIndex];
        const dx = tx - enemy.x;
        const dy = ty - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= speed) {
          updated.push({ ...enemy, x: tx, y: ty, pathIndex: targetIndex });
        } else {
          updated.push({
            ...enemy,
            x: enemy.x + (dx / dist) * speed,
            y: enemy.y + (dy / dist) * speed
          });
        }
      }

      enemiesRef.current = updated;
      setEnemies([...updated]);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [waveStarted]);

  const handleHitEnemy = (id: number, damage: number) => {
    const updated = enemiesRef.current.flatMap(enemy => {
      if (enemy.id === id) {
        const newHp = enemy.hp - damage;
        if (newHp <= 0) {
          setMoney(prev => prev + 10);
          setEnemiesRemaining(prev => {
            const next = Math.max(prev - 1, 0);
            if (next === 0) setWaveStarted(false);
            return next;
          });
          return [];
        }
        return { ...enemy, hp: newHp };
      }
      return enemy;
    });
    enemiesRef.current = updated;
    setEnemies([...updated]);
  };

  const handleCellClick = (x: number, y: number, cell: CellType) => {
    if (cell === "grass") {
      setTowers(prev => [...prev, { x, y }]);
    } else {
      alert("No puedes colocar una torre en el camino de los enemigos!");
    }
  };

  return (
    <>
      <Map mapLayout={mapLayout} onCellClick={handleCellClick} />
      {towers.map((tower, index) => (
        <Tower
          key={index}
          x={tower.x}
          y={tower.y}
          range={15}
          damage={10}
          enemies={enemies}
          onHitEnemy={handleHitEnemy}
        />
      ))}
      {enemies.map(enemy => (
        <Enemy key={enemy.id} {...enemy} />
      ))}
      <GameUI
        health={health}
        money={money}
        enemiesRemaining={enemiesRemaining}
        waveStarted={waveStarted}
        startWave={startWave}
      />
    </>
  );
};

export default GameBoard;