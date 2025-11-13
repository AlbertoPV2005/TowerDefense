import React, { useState, useEffect } from "react";
import "../styles/Map.css";
import type { CellType } from "../types";
import Tower from "./Tower";
import Enemy from "./Enemy";

const gridSize = 100; // número de celdas por lado

// Generar camino continuo
function generatePath(): [number, number][] {
  const path: [number, number][] = [];
  const segments: [number, number][] = [
    [0, 20],
    [70, 20],
    [70, 60],
    [30, 60],
    [30, gridSize - 1]
  ];

  for (let i = 0; i < segments.length - 1; i++) {
    const [sx, sy] = segments[i];
    const [ex, ey] = segments[i + 1];

    if (sx === ex) {
      const step = sy < ey ? 1 : -1;
      for (let y = sy; y !== ey + step; y += step) {
        path.push([sx, y]);
      }
    } else {
      const step = sx < ex ? 1 : -1;
      for (let x = sx; x !== ex + step; x += step) {
        path.push([x, sy]);
      }
    }
  }

  return path;
}

const pathCoords = generatePath();

const mapLayout: CellType[][] = Array.from({ length: gridSize }, (_, y) =>
  Array.from({ length: gridSize }, (_, x) =>
    pathCoords.some(([px, py]) => px === x && py === y) ? "path" : "grass"
  )
);

type MapProps = {
  waveStarted: boolean;
  onEnemyDeath: () => void;
  onEnemyEscape: () => void;
};

const Map: React.FC<MapProps> = ({ waveStarted, onEnemyDeath, onEnemyEscape }) => {
  const [towers, setTowers] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<{ id: number; x: number; y: number; hp: number; pathIndex: number }[]>([]);

  // Spawnear enemigos cada 1.5 segundos
  useEffect(() => {
    if (waveStarted) {
      setEnemies([]); // limpiar enemigos previos
      let count = 0;
      const spawnInterval = setInterval(() => {
        if (count < 10) {
          setEnemies(prev => [
            ...prev,
            {
              id: count + 1,
              x: pathCoords[0][0],
              y: pathCoords[0][1],
              hp: 50,
              pathIndex: 0
            }
          ]);
          count++;
        } else {
          clearInterval(spawnInterval);
        }
      }, 1500);
      return () => clearInterval(spawnInterval);
    }
  }, [waveStarted]);

  // Movimiento de enemigos siguiendo el camino
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setEnemies(prev =>
        prev.flatMap(enemy => {
          if (enemy.pathIndex < pathCoords.length - 1) {
            const nextIndex = enemy.pathIndex + 1;
            const [nx, ny] = pathCoords[nextIndex];
            return { ...enemy, x: nx, y: ny, pathIndex: nextIndex };
          } else {
            onEnemyEscape();
            return [];
          }
        })
      );
    }, 500);
    return () => clearInterval(moveInterval);
  }, [onEnemyEscape]);

  const handleHitEnemy = (id: number, damage: number) => {
    setEnemies(prev =>
      prev.flatMap(enemy => {
        if (enemy.id === id) {
          const newHp = enemy.hp - damage;
          if (newHp <= 0) {
            onEnemyDeath();
            return [];
          }
          return { ...enemy, hp: newHp };
        }
        return enemy;
      })
    );
  };

  const handleCellClick = (x: number, y: number, cell: CellType) => {
    if (cell === "grass") {
      setTowers([...towers, { x, y }]);
    } else {
      alert("No puedes colocar una torre en el camino de los enemigos!");
    }
  };

  return (
    <div className="map">
      {mapLayout.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`cell ${cell}`}
            onClick={() => handleCellClick(x, y, cell)}
          />
        ))
      )}

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
    </div>
  );
};

export default Map;