import { GameObject } from '@/modules/core/GameObject';
import Grid from '@/modules/core/Grid';
import Store from '@/modules/app/Store';
import Cell from '@/modules/core/Cell';
import { Colors, smoothMoveTo, getRandomColor, getMaxAvailibleSideSize } from '@/utils';
import RestartView from '@/modules/ui/RestartView';
import StartView from '@/modules/ui/StartView';
import { gsap } from 'gsap';
import App from '@/modules/app/App';

export default class GameManager {
  private app: App = new App();
  private store: Store = new Store();
  private grid = new Grid(getMaxAvailibleSideSize());

  private availibleCells: Cell[] = [];
  private availibleForMerge: GameObject[] = [];
  private selectedObject: GameObject | null = null;
  private pause = false;
  private restartView: RestartView;
  private startView: StartView;

  constructor() {
    const size = getMaxAvailibleSideSize();
    this.setMainContainer();
    this.setListeners();

    this.grid.generateGameObjects();

    this.grid.gameObjects.forEach((gameObject: GameObject) => {
      this.app.container.addChild(gameObject);
    });
    this.app.instance.stage.addChild(this.app.container);
    this.app.instance.stage.hitArea = this.app.instance.screen;

    this.restartView = new RestartView(size);
    this.startView = new StartView(size);
    this.startView.show();
    this.restartView.container.on('mg-restart', () => this.restartGame());
    this.startView.container.on('mg-start', () => {
      this.startView.hide();
      this.startGame();
    });

    this.app.instance.stage.addChild(this.startView.container);
    this.app.instance.stage.addChild(this.restartView.container);

    window.addEventListener('resize', () => this.resizeGrid());
  }

  private resizeGrid() {
    const newSize = getMaxAvailibleSideSize();

    this.app.instance.renderer.resize(newSize, newSize);
    this.grid.updateSize(newSize);
    this.startView.resize();
    this.restartView.resize();
  }

  private setMainContainer(): void {
    this.app.container.eventMode = 'dynamic';
    this.app.container.sortableChildren = true;
    this.app.container.interactiveChildren = true;
    this.app.container.eventMode = 'none';
    this.app.container.addChild(...this.grid.cellsContainers);
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

    const cells = this.grid.flatCells;
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

  private addNewObject(cell: Cell, color: Colors): void {
    const newGameObject = new GameObject(cell, color);

    this.grid.gameObjects.push(newGameObject);
    this.app.container.addChild(newGameObject);

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

  private setObjectToCell(object: GameObject, cell: Cell): void {
    const cellGameObject = cell.getGameObject();
    const cellSize = this.grid.size;
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

    object.selection.alpha = 0;
    object.selection.zIndex = 1;
    object.getCell()!.removeGameObject();
    cell.setGameObject(object);
    smoothMoveTo(object, cellX, cellY, 0.5);
    object.setCell(cell);
    this.selectedObject = object;

    this.cleanSteps();
    const randomEmptyCell = this.grid.getRandomEmptyCell();

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
    const cellSize = this.grid.size;
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
    const cellGameObject = cell.getGameObject() || null;
    if (!cellGameObject) return;

    const cellSize = this.grid.size;
    const cellX = cellSize * cell.x + cellSize / 2;
    const cellY = cellSize * cell.y + cellSize / 2;

    cellGameObject.x = object.x;
    cellGameObject.y = object.y;
    smoothMoveTo(cellGameObject!, cellX, cellY, 0.5);
    cellGameObject.selection.alpha = 0.9;
    cellGameObject.selection.zIndex = 2;

    object.destroy();
    object.getCell().removeGameObject();
    object.selection.alpha = 0;
    this.levelUpObject(cellGameObject);
    this.selectedObject = cellGameObject;
    const gameObjectIndex = this.grid.gameObjects.indexOf(object);
    this.grid.gameObjects.splice(gameObjectIndex, 1);

    this.cleanSteps();

    const randomEmptyCell = this.grid.getRandomEmptyCell();

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

    this.grid.gameObjects.forEach((gameObject: GameObject) => {
      gameObject.destroy();
    });

    this.selectedObject = null;

    this.grid.gameObjects = [];
    this.grid.cleanAllCells();

    this.selectedObject = null;

    this.store.reset();
    this.grid.generateGameObjects();
    this.grid.gameObjects.forEach((gameObject: GameObject) => {
      this.app.container.addChild(gameObject);
    });
    this.app.container.eventMode = 'dynamic';
    this.restartView.hide();
    this.pause = false;
    this.app.instance.ticker.start();
  }

  private levelUpObject(object: GameObject): void {
    object.levelUp();
    this.store.incrementScore(object.getLevel());
  }

  private startGame(): void {
    this.app.container.eventMode = 'dynamic';
    this.app.instance.ticker.add(() => {
      if (this.grid.isFull) {
        this.pause = true;
        this.restartView.show();
        this.restartView.setScoreText(
          this.app.instance.view.width,
          this.app.instance.view.height,
          this.store.getScore(),
          this.store.getBestScore(),
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
  }
}
