import React, { useState, useEffect } from "react";
import "../styles/Map.css";
import type { CellType } from "../types";
import Tower from "./Tower";
import Enemy from "./Enemy";

const size = 100;
const pathWidth = 4;

// Función para marcar segmentos del camino
function drawSegment(
  path: [number, number][],
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  if (startX === endX) {
    const [minY, maxY] = [Math.min(startY, endY), Math.max(startY, endY)];
    for (let y = minY; y <= maxY; y++) {
      for (let dx = 0; dx < pathWidth; dx++) {
        path.push([startX + dx, y]);
      }
    }
  } else if (startY === endY) {
    const [minX, maxX] = [Math.min(startX, endX), Math.max(startX, endX)];
    for (let x = minX; x <= maxX; x++) {
      for (let dy = 0; dy < pathWidth; dy++) {
        path.push([x, startY + dy]);
      }
    }
  }
}

function generatePath(): [number, number][] {
  const path: [number, number][] = [];
  const x = 0;
  const y = 20;

  drawSegment(path, x, y, 70, y);
  drawSegment(path, 70, y, 70, 60);
  drawSegment(path, 70, 60, 30, 60);
  drawSegment(path, 30, 60, 30, size - 1);

  return path;
}

const pathCoords = generatePath();

const mapLayout: CellType[][] = Array.from({ length: size }, (_, y) =>
  Array.from({ length: size }, (_, x) =>
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
  const [enemies, setEnemies] = useState<{ id: number; x: number; y: number; hp: number }[]>([]);

  // Spawnear enemigos cuando empieza la oleada
  useEffect(() => {
    if (waveStarted) {
      const newEnemies = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        x: pathCoords[0][0],
        y: pathCoords[0][1],
        hp: 50,
      }));
      setEnemies(newEnemies);
    }
  }, [waveStarted]);

  // Movimiento de enemigos
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prev) =>
        prev.flatMap((enemy) => {
          const currentIndex = pathCoords.findIndex(
            ([px, py]) => px === enemy.x && py === enemy.y
          );
          if (currentIndex < pathCoords.length - 1) {
            const [nx, ny] = pathCoords[currentIndex + 1];
            return { ...enemy, x: nx, y: ny };
          } else {
            // enemigo llegó al final
            onEnemyEscape();
            return []; // lo eliminamos
          }
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [onEnemyEscape]);

  // Callback para aplicar daño
  const handleHitEnemy = (id: number, damage: number) => {
    setEnemies((prev) =>
      prev.flatMap((enemy) => {
        if (enemy.id === id) {
          const newHp = enemy.hp - damage;
          if (newHp <= 0) {
            onEnemyDeath();
            return []; // enemigo eliminado
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

      {/* Renderizamos las torres */}
      {towers.map((tower, index) => (
        <Tower
          key={index}
          x={tower.x * 10}
          y={tower.y * 10}
          range={50}
          damage={10}
          enemies={enemies}
          onHitEnemy={handleHitEnemy}
        />
      ))}

      {/* Renderizamos los enemigos */}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} {...enemy} />
      ))}
    </div>
  );
};

export default Map;