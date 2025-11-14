import React, { useState, useEffect, useRef } from "react";
import "../styles/Map.css";
import type { CellType } from "../types";
import Tower from "./Tower";
import Enemy from "./Enemy";
import StaticMap from "./StaticMap"; // nuevo componente para el mapa estático

const gridSize = 100;
const pathRadius = 3;

function generatePath() {
  const pathCells = new Set<string>();
  const pathCoords: [number, number][] = [];

  const segments: [number, number][] = [
    [0, 20],
    [70, 20],
    [70, 60],
    [30, 60],
    [30, gridSize - 1]
  ];

  const addCell = (x: number, y: number) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      pathCells.add(`${x},${y}`);
    }
  };

  for (let i = 0; i < segments.length - 1; i++) {
    const [sx, sy] = segments[i];
    const [ex, ey] = segments[i + 1];
    const dx = ex - sx;
    const dy = ey - sy;
    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 2); // más resolución
    const stepX = dx / steps;
    const stepY = dy / steps;

    for (let s = 0; s <= steps; s++) {
      const cx = Math.round(sx + s * stepX);
      const cy = Math.round(sy + s * stepY);

      if (!pathCoords.some(([px, py]) => px === cx && py === cy)) {
        pathCoords.push([cx, cy]);
      }

      for (let ox = -pathRadius; ox <= pathRadius; ox++) {
        for (let oy = -pathRadius; oy <= pathRadius; oy++) {
          if (ox * ox + oy * oy <= pathRadius * pathRadius) {
            addCell(cx + ox, cy + oy);
          }
        }
      }
    }
  }

  return {
    pathCoords,
    pathCells: Array.from(pathCells).map(c => c.split(",").map(Number) as [number, number])
  };
}

const { pathCoords, pathCells } = generatePath();

const mapLayout: CellType[][] = Array.from({ length: gridSize }, (_, y) =>
  Array.from({ length: gridSize }, (_, x) =>
    pathCells.some(([px, py]) => px === x && py === y) ? "path" : "grass"
  )
);

type MapProps = {
  waveStarted: boolean;
  onEnemyDeath: () => void;
  onEnemyEscape: () => void;
};

const Map: React.FC<MapProps> = ({ waveStarted, onEnemyDeath, onEnemyEscape }) => {
  const [towers, setTowers] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<
    { id: number; x: number; y: number; hp: number; pathIndex: number }[]
  >([]);

  const enemiesRef = useRef<typeof enemies>([]);
  enemiesRef.current = enemies;

  useEffect(() => {
    if (waveStarted) {
      setEnemies([]);
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
      return () => clearInterval(spawnInterval);
    }
  }, [waveStarted]);

  useEffect(() => {
    if (!waveStarted) return;

    let animationFrame: number;
    const speed = 0.15;

    const animate = () => {
      const updated: typeof enemiesRef.current = [];

      for (const enemy of enemiesRef.current) {
        const targetIndex = enemy.pathIndex + 1;
        if (targetIndex >= pathCoords.length) {
          onEnemyEscape();
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
  }, [waveStarted, onEnemyEscape]);

  const handleHitEnemy = (id: number, damage: number) => {
    const updated = enemiesRef.current.flatMap(enemy => {
      if (enemy.id === id) {
        const newHp = enemy.hp - damage;
        if (newHp <= 0) {
          onEnemyDeath();
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
      <StaticMap mapLayout={mapLayout} onCellClick={handleCellClick} />

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
    </>
  );
};

export default Map;