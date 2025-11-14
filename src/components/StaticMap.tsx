import React from "react";
import "../styles/Map.css";
import type { CellType } from "../types";

type StaticMapProps = {
  mapLayout: CellType[][];
  onCellClick: (x: number, y: number, cell: CellType) => void;
};

const StaticMap: React.FC<StaticMapProps> = React.memo(({ mapLayout, onCellClick }) => {
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
});

export default StaticMap;