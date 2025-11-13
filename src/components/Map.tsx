import '../styles/Map.css';
import type { CellType } from '../types';

const size = 100;
const pathWidth = 4;



// Función para marcar un segmento recto en el mapa
function drawSegment(path: [number, number][], startX: number, startY: number, endX: number, endY: number) {
  if (startX === endX) {
    // segmento vertical
    const [minY, maxY] = [Math.min(startY, endY), Math.max(startY, endY)];
    for (let y = minY; y <= maxY; y++) {
      for (let dx = 0; dx < pathWidth; dx++) {
        path.push([startX + dx, y]);
      }
    }
  } else if (startY === endY) {
    // segmento horizontal
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
  // Empieza un poco más abajo
  const x = 0;
  const y = 20;

  // 1er segmento horizontal
  drawSegment(path, x, y, 70, y);

  // 1ª curva → hacia abajo
  drawSegment(path, 70, y, 70, 60);

  // 2ª curva → hacia la izquierda
  drawSegment(path, 70, 60, 30, 60);

  // 3ª curva → hacia abajo hasta el final
  drawSegment(path, 30, 60, 30, size - 1);

  return path;
}

const pathCoords = generatePath();

// Generamos el mapa
const mapLayout: CellType[][] = Array.from({ length: size }, (_, y) =>
  Array.from({ length: size }, (_, x) =>
    pathCoords.some(([px, py]) => px === x && py === y) ? 'path' : 'grass'
  )
);

const Map: React.FC = () => {
  return (
    <div className="map">
      {mapLayout.map((row, y) =>
        row.map((cell, x) => (
          <div key={`${x}-${y}`} className={`cell ${cell}`} />
        ))
      )}
    </div>
  );
};

export default Map;