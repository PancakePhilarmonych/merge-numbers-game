import { GameObject } from './GameObject';
import Grid from './Grid';
import Store from './Store';
import * as PIXI from 'pixi.js';
import Cell from './Cell';
import { Colors, smoothMoveTo, getRandomColor } from '../utils';
import RestartView from './RestartView';
import { gsap } from 'gsap';
import App from './App';

export default class GameManager {
  private app: App = new App();
  private store: Store = new Store();
  private grid = new Grid(this.app.instance.view.width, this.app.instance.view.height);

  private availibleCells: Cell[] = [];
  private availibleForMerge: GameObject[] = [];
  private gameObjects: GameObject[] = [];
  private selectedObject: GameObject | null = null;
  private pause = false;
  private restartView: RestartView;

  constructor() {
    this.setMainContainer();
    this.setListeners();

    this.generateGameObjects();
    this.app.instance.stage.addChild(this.app.container);
    this.app.instance.stage.hitArea = this.app.instance.screen;

    this.createStartContainer();
    this.restartView = new RestartView(this.app.instance.view.width, this.app.instance.view.height);
    this.restartView.container.on('mg-restart', () => this.restartGame());
    this.app.instance.stage.addChild(this.restartView.container);
  }

  private setMainContainer(): void {
    const cellselectArea = this.grid.getContainers();
    this.app.container.eventMode = 'dynamic';
    this.app.container.sortableChildren = true;
    this.app.container.interactiveChildren = true;
    this.app.container.addChild(...cellselectArea);
  }

  private setListeners(): void {
    this.app.container.on('mg-select', (go: GameObject) => {
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

    this.app.container.on<any>('deselect', () => {
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
    this.app.container.eventMode = 'none';
    const startContainer = new PIXI.Container();
    startContainer.zIndex = 100;
    startContainer.width = this.app.instance.view.width;
    startContainer.height = this.app.instance.view.height;

    const startBackground = new PIXI.Graphics();
    startBackground.beginFill(0x2ecc71, 0.9);
    startBackground.drawRect(0, 0, this.app.instance.view.width, this.app.instance.view.height);
    startBackground.endFill();

    const buttonWidth = this.app.instance.view.width / 2;
    const buttonHeight = this.app.instance.view.height / 6;
    const radius = 15;

    const startButton = new PIXI.Container();

    const border = new PIXI.Graphics()
      .lineStyle(10, 0xffffff, 1)
      .drawRoundedRect(-3, -3, buttonWidth + 6, buttonHeight + 6, radius);

    startButton.addChild(border);

    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(0xf5cd79);
    buttonBackground.drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);
    buttonBackground.endFill();

    startButton.addChild(buttonBackground);

    startButton.zIndex = 101;
    startButton.x = this.app.instance.view.width / 2 - startButton.width / 2;
    startButton.y = this.app.instance.view.height / 2 - startButton.height / 2;
    startButton.eventMode = 'dynamic';
    startButton.cursor = 'pointer';

    const startText = new PIXI.Text('Start', {
      fill: 0xffffff,
      fontSize: 50,
      fontWeight: 'normal',
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
      this.app.instance.stage.removeChild(startContainer);
      this.app.container.eventMode = 'dynamic';
      this.app.instance.ticker.add(() => {
        const cells = this.grid.getCells();

        if (cells.every((cell: Cell) => cell.getGameObject() !== null)) {
          this.pause = true;
          this.restartView.show();
          this.restartView.setScoreText(
            this.app.instance.view.width,
            this.app.instance.view.height,
            this.store.getScore(),
          );

          if (this.selectedObject) {
            this.moveObjectToOwnCell(this.selectedObject);
            this.selectedObject.selection.alpha = 0;
            this.app.container.removeAllListeners();
            this.selectedObject = null;
          }
        }

        if (!this.selectedObject) return;

        this.selectedObject.selection.alpha = 0.9;
        this.selectedObject.selection.zIndex = 2;
      });
    });
  }

  private addNewObject(cell: Cell, color: Colors): void {
    const newGameObject = new GameObject(cell, color);

    this.gameObjects.push(newGameObject);
    this.app.container.addChild(newGameObject);
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

      cell.setGameObject(newGameObject);

      this.gameObjects.push(newGameObject);
      this.app.container.addChild(newGameObject);
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
    // gsap.to(object.selection, { alpha: 1, duration: 0.6 });
    // gsap.to(object.selection, { zIndex: 2, duration: 0.6 });
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
      setTimeout(() => {
        this.addNewObject(randomEmptyCell, getRandomColor(true));
      }, 500);
    }
    this.getAvailibleCellsAround(object);

    this.selectedObject.selection.alpha = 0;
    this.selectedObject = null;
    this.cleanSteps();
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

    this.selectedObject.selection.alpha = 0;
    this.selectedObject = null;
    this.cleanSteps();
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
      setTimeout(() => {
        this.addNewObject(randomEmptyCell, getRandomColor(true));
      }, 500);
    }

    this.getAvailibleCellsAround(cellGameObject!);

    this.selectedObject.selection.alpha = 0;
    this.selectedObject = null;
    this.cleanSteps();
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

    this.gameObjects.forEach((gameObject: GameObject) => {
      gameObject.destroy();
    });

    this.selectedObject = null;

    this.gameObjects = [];
    this.grid.getCells().forEach((cell: Cell) => {
      cell.removeGameObject();
      cell.alpha = 1;
    });

    this.selectedObject = null;

    this.store.reset();
    this.generateGameObjects();
    this.app.container.eventMode = 'dynamic';
    this.restartView.hide();
    this.pause = false;
    this.app.instance.ticker.start();
  }

  private levelUpObject(object: GameObject): void {
    object.levelUp();
    this.store.incrementScore(object.getLevel());
  }
}
