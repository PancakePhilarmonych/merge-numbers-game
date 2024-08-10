import * as PIXI from 'pixi.js';
import Cell from './Cell';
const DEFAULT_GRID_SIZE = 5;

export default class Grid {
  private cells: Cell[][];
  private selected: Cell | null = null;
  private cellSize: number;

  constructor(gameWidth: number, gameHeight: number) {
    this.cells = [];
    const cellWidth = gameWidth / DEFAULT_GRID_SIZE;
    const cellHeight = gameHeight / DEFAULT_GRID_SIZE;
    this.cellSize = cellWidth > cellHeight ? cellHeight : cellWidth;

    this.initRows(DEFAULT_GRID_SIZE);
  }

  private initRows(rowsCount: number): void {
    for (let row = 0; row < rowsCount; row++) {
      this.cells[row] = [];

      for (let col = 0; col < rowsCount; col++) {
        const cell = new Cell(col, row, this.cellSize);
        this.cells[row][col] = cell;
      }
    }
  }

  getContainers(): PIXI.Container[] {
    return this.cells.map((row: Cell[]) => row.map((cell: Cell) => cell)).flat();
  }

  getCells(): Cell[] {
    return this.cells.flat();
  }

  public getCell(x: number, y: number): Cell | null {
    return this.cells?.[x]?.[y] ?? null;
  }

  public select(cell: Cell): void {
    if (this.selected) {
      this.deselect();
    }

    this.selected = cell;
  }

  public deselect(): void {
    if (this.selected) {
      this.selected = null;
    }
  }

  getCellSize(): number {
    return this.cellSize;
  }

  getSelectedCellPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor(x / this.cells[x][y].position.x),
      y: Math.floor(y / this.cells[x][y].position.y),
    };
  }
}
