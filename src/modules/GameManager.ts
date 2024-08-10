import { GameObject } from './GameObject';
import Grid from './Grid';
import Store from './Store';
import * as PIXI from 'pixi.js';
import Cell from './Cell';
import { Colors, smoothMoveTo, getRandomColor } from '../utils';
import { gsap } from 'gsap';
import App from './App';

export default class GameManager {
  private app: App;
  private store: Store;
  private grid: Grid;
  private availibleCells: Cell[] = [];
  private availibleForMerge: GameObject[] = [];
  private gameObjects: GameObject[] = [];
  private hoveredCell: Cell | null = null;
  private selectedObject: GameObject | null = null;
  private pause = false;
  private container: PIXI.Container = new PIXI.Container();
  private restartContainer: PIXI.Container = new PIXI.Container();

  constructor() {
    this.app = new App();
    this.store = new Store();
    const instance = this.app.instance;
    this.grid = new Grid(instance.view.width, instance.view.height);
    const cellselectArea = this.grid.getContainers();
    this.container.eventMode = 'dynamic';
    this.container.sortableChildren = true;
    this.container.interactiveChildren = true;
    this.container.addChild(...cellselectArea);

    this.setListeners();

    this.generateGameObjects();
    instance.stage.addChild(this.container);
    instance.stage.hitArea = instance.screen;

    this.createStartContainer();
    this.createRestartContainer();
  }

  private setListeners(): void {
    this.container.on('mg-select', (go: GameObject) => {
      if (this.selectedObject && this.selectedObject === go) {
        this.selectedObject = null;
        this.cleanSteps();
        go.selection.alpha = 0;

        return;
      }
      if (this.pause) return;
      if (this.selectedObject === go) return;
      if (this.selectedObject) this.selectedObject.selection.alpha = 0;
      this.selectedObject = go;
      this.getAvailibleCellsAround(go);
    });

    this.container.on<any>('deselect', () => {
      if (!this.selectedObject) return;
      this.selectedObject = null;
    });
  }

  private getAvailibleCellsAround(gameObject: GameObject): void {
    this.cleanSteps();

    const cells = this.grid.getCells();
    const gameObjectCell = gameObject.getCell();
    const gameObjectX = gameObjectCell!.x;
    const gameObjectY = gameObjectCell!.y;

    cells.forEach((cell: Cell) => {
      const x = cell.x;
      const y = cell.y;
      const isAround =
        (x === gameObjectX && y === gameObjectY - 1) ||
        (x === gameObjectX && y === gameObjectY + 1) ||
        (x === gameObjectX - 1 && y === gameObjectY) ||
        (x === gameObjectX + 1 && y === gameObjectY);

      if (isAround && !cell.getGameObject()) {
        this.availibleCells.push(cell);
      }

      if (
        isAround &&
        cell.getGameObject() &&
        cell.getGameObject()!.getColor() === gameObject.getColor() &&
        cell.getGameObject()!.level === gameObject.level
      ) {
        this.availibleForMerge.push(cell.getGameObject()!);
        this.availibleCells.push(cell);
      }
    });

    this.availibleForMerge.forEach((go: GameObject) => {
      go.setAvailibleForMerge();
      go.on('pointerdown', () => {
        this.setObjectToCell(gameObject, go.getCell()!);
      });
    });

    this.availibleCells.forEach((cell: Cell) => {
      cell.availibleArea.alpha = 0.8;

      cell.availibleArea.zIndex = 1;
      cell.eventMode = 'dynamic';
      cell.cursor = 'pointer';
      cell.on('pointerdown', () => {
        this.setObjectToCell(gameObject, cell);
      });
    });
  }

  private createStartContainer(): void {
    this.container.eventMode = 'none';
    const startContainer = new PIXI.Container();
    startContainer.zIndex = 100;
    startContainer.width = this.app.instance.view.width;
    startContainer.height = this.app.instance.view.height;

    const startBackground = new PIXI.Graphics();
    startBackground.beginFill(0x2ecc71, 0.9);
    startBackground.drawRect(0, 0, this.app.instance.view.width, this.app.instance.view.height);
    startBackground.endFill();

    const startButton = new PIXI.Graphics();
    startButton.beginFill(0xffffff, 1);
    startButton.drawRoundedRect(
      0,
      0,
      this.app.instance.view.width / 2,
      this.app.instance.view.height / 6,
      5,
    );
    startButton.endFill();
    startButton.zIndex = 101;
    // startButton.lineStyle(2, 0xffffff);
    startButton.x = this.app.instance.view.width / 2 - startButton.width / 2;
    startButton.y = this.app.instance.view.height / 2 - startButton.height / 2;
    startButton.eventMode = 'dynamic';
    startButton.cursor = 'pointer';

    const startText = new PIXI.Text('Start', {
      fill: 0x000000,
      fontSize: startButton.height / 2,
      fontWeight: 'bold',
      fontFamily: 'Titan One',
      align: 'center',
    });
    startText.zIndex = 102;

    startText.x = startButton.x + startButton.width / 2 - startText.width / 2;
    startText.y = startButton.y + startButton.height / 2 - startText.height / 2;

    startContainer.addChild(startBackground);
    startContainer.addChild(startButton);
    startContainer.addChild(startText);
    startContainer.visible = true;

    this.app.instance.stage.addChild(startContainer);

    startButton.on('pointerdown', () => {
      const instance = this.app.instance;
      this.app.instance.stage.removeChild(startContainer);
      this.container.eventMode = 'dynamic';
      instance.ticker.add(() => {
        const cells = this.grid.getCells();

        if (cells.every((cell: Cell) => cell.getGameObject() !== null)) {
          this.restartContainer.visible = true;
          this.pause = true;

          const scoreText = new PIXI.Text(`Score: ${this.store.getScore()}`, {
            fill: 0xffffff,
            fontSize: 40,
            fontFamily: 'Titan One',
            align: 'center',
          });

          scoreText.x = this.app.instance.view.width / 2 - scoreText.width / 2;
          scoreText.y = this.app.instance.view.height / 2 - scoreText.height / 2 - 100;

          this.restartContainer.removeChild(this.restartContainer.children[3]);
          this.restartContainer.addChild(scoreText);

          if (this.selectedObject) {
            this.moveObjectToOwnCell(this.selectedObject);
            this.selectedObject.selection.alpha = 0;
            this.container.removeAllListeners();
            this.selectedObject = null;
          }

          setTimeout(() => {
            instance.ticker.stop();
            this.container.eventMode = 'none';
          }, 500);
        }

        if (!this.selectedObject) return;

        this.selectedObject.selection.alpha = 0.9;
        this.selectedObject.selection.zIndex = 2;
      });
    });
  }

  private createRestartContainer(): void {
    this.restartContainer = new PIXI.Container();
    this.restartContainer.zIndex = 100;
    this.restartContainer.width = this.app.instance.view.width;
    this.restartContainer.height = this.app.instance.view.height;

    const pauseBackground = new PIXI.Graphics();
    pauseBackground.beginFill(0xff7675, 0.9);
    pauseBackground.drawRect(0, 0, this.app.instance.view.width, this.app.instance.view.height);
    pauseBackground.endFill();

    const restartButton = new PIXI.Graphics();
    restartButton.beginFill(0xffffff, 1);
    restartButton.drawRoundedRect(
      0,
      0,
      this.app.instance.view.width / 2,
      this.app.instance.view.height / 6,
      5,
    );
    restartButton.endFill();
    restartButton.zIndex = 101;
    // restartButton.lineStyle(2, 0xffffff);
    restartButton.x = this.app.instance.view.width / 2 - restartButton.width / 2;
    restartButton.y = this.app.instance.view.height / 2 - restartButton.height / 2;
    restartButton.eventMode = 'dynamic';
    restartButton.cursor = 'pointer';

    const restartText = new PIXI.Text('Restart', {
      fill: 0x000000,
      fontSize: restartButton.height / 2,
      fontFamily: 'Titan One',
      align: 'center',
    });
    restartText.zIndex = 102;

    restartText.x = restartButton.x + restartButton.width / 2 - restartText.width / 2;
    restartText.y = restartButton.y + restartButton.height / 2 - restartText.height / 2;

    this.restartContainer.addChild(pauseBackground);
    this.restartContainer.addChild(restartButton);
    this.restartContainer.addChild(restartText);
    this.restartContainer.visible = false;

    this.app.instance.stage.addChild(this.restartContainer);

    restartButton.on('pointerdown', () => this.restartGame());
  }

  private addNewObject(cell: Cell, color: Colors): void {
    const newGameObject = new GameObject(cell, color);

    this.gameObjects.push(newGameObject);
    this.container.addChild(newGameObject);
    cell.setGameObject(newGameObject);

    gsap.from(newGameObject, {
      alpha: 0.0,
      duration: 0.3,
      ease: 'power2.out',
      y: cell.sprite.y - 40,

      onComplete: () => {
        newGameObject.setCell(cell);
        newGameObject.eventMode = 'dynamic';
      },
    });
  }

  public deleteSelectedObject(): void {
    if (!this.selectedObject) return;
    gsap.to(this.selectedObject, { alpha: 0.1, duration: 0.2 });
    gsap.to(this.selectedObject.selection, {
      alpha: 0.0,
      duration: 0.2,
    });
    this.selectedObject.destroy();
    const gameObjectIndex = this.gameObjects.indexOf(this.selectedObject);
    this.gameObjects.splice(gameObjectIndex, 1);
    this.selectedObject.getCell()!.removeGameObject();
    this.selectedObject = null;
  }

  private generateGameObjects(): void {
    const gridCells = this.grid.getCells();
    gridCells.forEach((cell: Cell) => {
      const randomColor = getRandomColor();

      if (randomColor === Colors.EMPTY) return;

      const newGameObject = new GameObject(cell, randomColor);

      // newGameObject.setCell(cell);
      cell.setGameObject(newGameObject);

      this.gameObjects.push(newGameObject);
      this.container.addChild(newGameObject);
    });

    if (this.gameObjects.length < 16) {
      this.generateGameObjects();
    }
  }

  private setObjectToCell(object: GameObject, cell: Cell): void {
    const cellGameObject = cell.getGameObject();
    const cellSize = this.grid.getCellSize();
    const cellX = cellSize * cell.x + cellSize / 2;
    const cellY = cellSize * cell.y + cellSize / 2;

    if (cellGameObject) {
      if (cellGameObject === object) {
        this.moveObjectToOwnCell(object);
        return;
      }

      const objectColor = object.getColor();
      const cellObjectColor = cellGameObject.getColor();
      const objectLevel = object.level;
      const cellObjectLevel = cellGameObject.level;

      const sameColor = objectColor === cellObjectColor;
      const sameLevel = objectLevel === cellObjectLevel;
      const sameColorAndLevel = sameColor && sameLevel;

      if (sameColorAndLevel) {
        this.moveObjectToMatchedCell(object, cell);
        return;
      }

      this.moveObjectToOwnCell(object);
      return;
    }

    // Hide
    object.selection.alpha = 0;
    object.selection.zIndex = 1;
    // Удаляем объект из клетки
    object.getCell()!.removeGameObject();
    // Ставим объект в текущую клетку
    cell.setGameObject(object);
    // Показываем спрайт выбора
    gsap.to(object.selection, { alpha: 1, duration: 0.6 });
    gsap.to(object.selection, { zIndex: 2, duration: 0.6 });
    // Перемещаем объект в центр клетки
    smoothMoveTo(object, cellX, cellY, 0.5);
    // Присваиваем объекту новую клетку
    object.setCell(cell);
    // Выбираем объект
    this.selectedObject = object;

    this.cleanSteps();
    const emptyCells = this.grid.getCells().filter((cell: Cell) => !cell.getGameObject());
    const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (randomEmptyCell) {
      this.addNewObject(randomEmptyCell, getRandomColor(true));
    }
    this.getAvailibleCellsAround(object);
  }

  moveObjectToOwnCell(object: GameObject): void {
    const cellSize = this.grid.getCellSize();
    const objectCell = object.getCell()!;

    const objectCellX = cellSize * objectCell.x + cellSize / 2;
    const objectCellY = cellSize * objectCell.y + cellSize / 2;

    smoothMoveTo(object, objectCellX, objectCellY, 0.5);
    object.selection.alpha = 0.9;
    object.selection.zIndex = 2;
    this.selectedObject = object;
  }

  moveObjectToMatchedCell(object: GameObject, cell: Cell): void {
    const cellGameObject = cell.getGameObject();
    const cellSize = this.grid.getCellSize();
    const cellX = cellSize * cell.x + cellSize / 2;
    const cellY = cellSize * cell.y + cellSize / 2;

    cellGameObject!.x = object.x;
    cellGameObject!.y = object.y;
    smoothMoveTo(cellGameObject!, cellX, cellY, 0.5);
    cellGameObject!.selection.alpha = 0.9;
    cellGameObject!.selection.zIndex = 2;

    object.destroy();
    object.getCell()!.removeGameObject();
    object.selection.alpha = 0;
    this.levelUpObject(cellGameObject!);
    this.selectedObject = cellGameObject!;
    const gameObjectIndex = this.gameObjects.indexOf(object);
    this.gameObjects.splice(gameObjectIndex, 1);

    this.cleanSteps();

    const emptyCells = this.grid.getCells().filter((cell: Cell) => !cell.getGameObject());
    const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (randomEmptyCell) {
      this.addNewObject(randomEmptyCell, getRandomColor(true));
    }

    this.getAvailibleCellsAround(cellGameObject!);
  }

  private cleanSteps(): void {
    this.availibleCells.forEach((cell: Cell) => {
      cell.availibleArea.alpha = 0;
      cell.availibleArea.zIndex = 1;
      cell.eventMode = 'none';
      cell.cursor = 'default';
      cell.removeAllListeners();
    });

    this.availibleForMerge.forEach((go: GameObject) => {
      go.off('pointerdown');
      go.setUnavailibleForMerge();
    });

    this.availibleCells = [];
    this.availibleForMerge = [];
  }

  public restartGame(): void {
    this.cleanSteps();
    this.setListeners();

    this.gameObjects.forEach((gameObject: GameObject) => {
      gameObject.destroy();
    });

    this.selectedObject = null;
    this.hoveredCell = null;

    this.gameObjects = [];
    this.grid.getCells().forEach((cell: Cell) => {
      cell.removeGameObject();
      cell.alpha = 1;
    });

    this.hoveredCell = null;
    this.selectedObject = null;

    this.store.reset();
    this.generateGameObjects();
    this.container.eventMode = 'dynamic';
    this.restartContainer.visible = false;
    this.pause = false;
    this.app.instance.ticker.start();
  }

  private levelUpObject(object: GameObject): void {
    object.levelUp();
    this.store.incrementScore(object.getLevel());
  }
}
