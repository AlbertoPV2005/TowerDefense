import React from "react";
import "../styles/Enemy.css";

type EnemyProps = {
  id: number;
  x: number;
  y: number;
  hp: number;
};

const Enemy: React.FC<EnemyProps> = ({ x, y, hp }) => {
  return (
    <div
      className="enemy"
      style={{
        position: "absolute",
        left: `${(x / 100) * 100}%`, // ajustado al grid
        top: `${(y / 100) * 100}%`,  // ajustado al grid
        transform: "translate(-50%, -50%)" // centrar el enemigo
      }}
    >
      ❤️{hp}
    </div>
  );
};

export default Enemy;