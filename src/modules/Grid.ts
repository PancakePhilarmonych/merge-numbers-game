import * as PIXI from 'pixi.js';
import Cell from './Cell';
import { GameObject } from './GameObject';
import { Colors, getRandomColor } from './../utils';
const DEFAULT_GRID_SIZE = 4;

export default class Grid {
  private cells: Cell[][];
  private selected: Cell | null = null;
  public gameObjects: GameObject[];
  public size: number;

  constructor(size: number) {
    this.cells = [];
    this.gameObjects = [];
    this.size = size / DEFAULT_GRID_SIZE;

    this.initRows(DEFAULT_GRID_SIZE);
  }

  private initRows(rowsCount: number): void {
    for (let row = 0; row < rowsCount; row++) {
      this.cells[row] = [];

      for (let col = 0; col < rowsCount; col++) {
        const cell = new Cell(col, row, this.size);
        this.cells[row][col] = cell;
      }
    }
  }

  getContainers(): PIXI.Container[] {
    return this.cells.map((row: Cell[]) => row.map((cell: Cell) => cell)).flat();
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

  getSelectedCellPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor(x / this.cells[x][y].position.x),
      y: Math.floor(y / this.cells[x][y].position.y),
    };
  }

  cleanAllCells(): void {
    this.cells.forEach(row =>
      row.forEach(cell => {
        cell.removeGameObject();
        cell.alpha = 1;
      }),
    );
  }

  getRandomEmptyCell(): Cell {
    return this.emptyCells[Math.floor(Math.random() * this.emptyCells.length)];
  }

  get flatCells(): Cell[] {
    return this.cells.flat();
  }

  get emptyCells(): Cell[] {
    return this.flatCells.filter(cell => cell.getGameObject() === null);
  }

  get isFull(): boolean {
    return this.flatCells.every((cell: Cell) => cell.getGameObject() !== null);
  }

  public generateGameObjects(): void {
    this.flatCells.forEach((cell: Cell) => {
      if (this.gameObjects.length >= 15) return;
      const hasGameObject = cell.getGameObject();

      if (hasGameObject) return;

      const randomColor = getRandomColor();

      if (randomColor === Colors.EMPTY) return;

      const newGameObject = new GameObject(cell, randomColor);

      this.gameObjects.push(newGameObject);
    });

    if (this.gameObjects.length < 15) {
      this.generateGameObjects();
    }
  }

  public updateSize(newSize: number) {
    this.size = newSize / DEFAULT_GRID_SIZE;

    for (let row = 0; row < DEFAULT_GRID_SIZE; row++) {
      for (let col = 0; col < DEFAULT_GRID_SIZE; col++) {
        const cell = this.cells[row][col];
        cell.updateSize(this.size);
      }
    }
  }
}
