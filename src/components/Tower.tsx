import React, { useEffect, useState } from "react";
import "../styles/Tower.css";

type Enemy = {
  id: number;
  x: number;
  y: number;
  hp: number;
};

type TowerProps = {
  x: number;
  y: number;
  range: number;
  damage: number;
  enemies: Enemy[];
  onHitEnemy: (id: number, damage: number) => void; // callback para aplicar daño
};

const Tower: React.FC<TowerProps> = ({ x, y, range, damage, enemies, onHitEnemy }) => {
  const [target, setTarget] = useState<Enemy | null>(null);

  // Buscar enemigo dentro del rango
  useEffect(() => {
    const inRange = enemies.find(
      (enemy) =>
        Math.sqrt((enemy.x * 10 - x) ** 2 + (enemy.y * 10 - y) ** 2) <= range
    );
    setTarget(inRange || null);
  }, [enemies, x, y, range]);

  // Disparar al enemigo objetivo
  useEffect(() => {
    if (target) {
      const interval = setInterval(() => {
        console.log(`Tower at (${x},${y}) dispara a enemigo ${target.id}`);
        onHitEnemy(target.id, damage);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [target, damage, x, y, onHitEnemy]);

  return (
    <div
      className="tower"
      style={{
        left: x,
        top: y,
      }}
    >
      T
    </div>
  );
};

export default Tower;