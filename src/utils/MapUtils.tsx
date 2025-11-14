import type { CellType } from "../types";

export const gridSize = 100;
const pathRadius = 3;

export function generatePath() {
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
    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 2);
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

export const mapLayout: CellType[][] = (() => {
  const { pathCells } = generatePath();
  return Array.from({ length: gridSize }, (_, y) =>
    Array.from({ length: gridSize }, (_, x) =>
      pathCells.some(([px, py]) => px === x && py === y) ? "path" : "grass"
    )
  );
})();