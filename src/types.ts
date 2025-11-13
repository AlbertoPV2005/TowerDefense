export type CellType = 'path' | 'grass' | 'tower';

export interface Cell {
  x: number;
  y: number;
  type: CellType;
}

