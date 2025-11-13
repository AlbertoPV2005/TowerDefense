import React, { useEffect } from "react";
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
  onHitEnemy: (id: number, damage: number) => void;
};

const Tower: React.FC<TowerProps> = ({ x, y, range, damage, enemies, onHitEnemy }) => {
  const target = enemies.reduce<Enemy | null>((closest, enemy) => {
    const dist = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
    if (dist <= range && (!closest || dist < Math.sqrt((closest.x - x) ** 2 + (closest.y - y) ** 2))) {
      return enemy;
    }
    return closest;
  }, null);

  useEffect(() => {
    if (target) {
      const interval = setInterval(() => {
        onHitEnemy(target.id, damage);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [target, damage, onHitEnemy]);

  return (
    <div
      className="tower"
      style={{
        left: `${(x / 100) * 100}%`,
        top: `${(y / 100) * 100}%`,
      }}
    >
      🏰
    </div>
  );
};

export default Tower;