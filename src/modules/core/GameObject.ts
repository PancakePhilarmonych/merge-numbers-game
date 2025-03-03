import * as PIXI from 'pixi.js';
import Cell from '@/modules/core/Cell';
import { Colors, getHexColorByColor } from '@/utils';

export class GameObject extends PIXI.Container {
  private color: Colors;
  private cell: Cell;
  private sprite: PIXI.Graphics;
  public selection: PIXI.Graphics;

  public level: number = 1;
  public levelText: PIXI.Text;

  constructor(cell: Cell, color: Colors, size: number) {
    const [x, y] = [cell.x, cell.y];

    super();
    this.cell = cell;
    this.color = color;
    this.position = { x, y };

    this.x = size * x;
    this.y = size * y;
    this.zIndex = 1;

    this.sprite = this.createGameObjectGraphics(size);
    this.selection = this.createSelectionGraphics(size, 30);

    this.selection.alpha = 0;
    this.selection.zIndex = 2;

    this.eventMode = 'dynamic';
    this.cursor = 'pointer';

    this.levelText = new PIXI.Text(this.getLevel(), {
      fontSize: this.sprite.width / 3,
      fontFamily: 'Titan One',
      fill: 0xffffff,
    });

    this.levelText.x = this.sprite.x + this.levelText.width / 2 + 80;
    this.levelText.y = this.sprite.y + this.levelText.height / 2 + 80 / 2;
    this.levelText.eventMode = 'none';
    this.sprite.addChild(this.levelText);
    this.addChild(this.selection);
    this.addChild(this.sprite);

    this.on('pointerdown', this.onPointedDown, this);
    cell.setGameObject(this);
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
    this.x = x;
    this.y = y;
  }

  onPointedDown() {
    this.parent.emit('mg-select', this);
  }

  setAvailibleForMerge() {
    this.off('pointerdown', this.onPointedDown, this);
  }

  setUnavailibleForMerge() {
    this.on('pointerdown', this.onPointedDown, this);
  }

  setCell(cell: Cell) {
    this.cell = cell;
  }

  getCell() {
    return this.cell;
  }

  getColor() {
    return this.color;
  }

  setColor(color: Colors) {
    this.color = color;
    this.sprite = this.createGameObjectGraphics(this.sprite.width);
  }

  public getLevel() {
    let result = 1;

    for (let i = 1; i < this.level; i++) {
      result *= 2;
    }

    return result;
  }

  levelUp() {
    this.level++;
    this.levelText.text = this.getLevel();
  }

  private createGameObjectGraphics(size: number, offset = 80, color = '0xffffff') {
    const border = new PIXI.Graphics()
      .lineStyle(5, color, 1)
      .drawRoundedRect(0 + offset / 2, 0 + offset / 2, size - offset, size - offset, 15);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(getHexColorByColor(this.color));
    graphics.drawRoundedRect(0 + offset / 2, 0 + offset / 2, size - offset, size - offset, 15);
    graphics.endFill();
    graphics.addChild(border);

    graphics.zIndex = 2;
    return graphics;
  }

  private createSelectionGraphics(size: number, offset = 80, color = '0xffffff') {
    const border = new PIXI.Graphics()
      .lineStyle(10, color, 0.4)
      .drawRoundedRect(0 + offset / 2, 0 + offset / 2, size - offset, size - offset, 15);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(color, 0.6);
    graphics.drawRoundedRect(0 + offset / 2, 0 + offset / 2, size - offset, size - offset, 15);
    graphics.endFill();
    graphics.addChild(border);

    graphics.zIndex = 0;
    return graphics;
  }

  public updateSize(size: number) {
    this.x = this.cell.x * size;
    this.y = this.cell.y * size;

    this.sprite.width = size;
    this.sprite.height = size;
    this.selection.width = size;
    this.selection.height = size;
    this.levelText.style.fontSize = size / 2;
    this.levelText.x = this.sprite.x;
    this.levelText.y = this.sprite.y;
  }
}
