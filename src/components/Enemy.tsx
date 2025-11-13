import React from "react";
import "../styles/Enemy.css";

type EnemyProps = {
  id: number;
  x: number;
  y: number;
  hp: number;
};

const Enemy: React.FC<EnemyProps> = ({x, y, hp }) => {
  return (
    <div
      className="enemy"
      style={{
        left: `${(x / 100) * 100}%`,
        top: `${(y / 100) * 100}%`,
      }}
    >
      ❤️{hp}
    </div>
  );
};

export default Enemy;