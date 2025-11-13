import React from "react";
import "../styles/Enemy.css";

type EnemyProps = {
  id: number;
  x: number;
  y: number;
  hp: number;
};

const Enemy: React.FC<EnemyProps> = ({ id, x, y, hp }) => {
  return (
    <div
      className="enemy"
      style={{
        left: x * 10,
        top: y * 10,
      }}
    >
      👾{id} | ❤️{hp}
    </div>
  );
};

export default Enemy;