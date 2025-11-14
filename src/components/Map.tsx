import React from "react";
import "../styles/Map.css";
import type { CellType } from "../types";

type MapProps = {
  mapLayout: CellType[][];
  onCellClick: (x: number, y: number, cell: CellType) => void;
};

const Map: React.FC<MapProps> = ({ mapLayout, onCellClick }) => {
  return (
    <div className="map">
      {mapLayout.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`cell ${cell}`}
            onClick={() => onCellClick(x, y, cell)}
          />
        ))
      )}
    </div>
  );
};

export default React.memo(Map);