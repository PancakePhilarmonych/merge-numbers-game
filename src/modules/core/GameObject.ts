import * as PIXI from 'pixi.js';
import Cell from '@/modules/core/Cell';
import { Colors, getHexColorByColor, getSpriteByColor } from '@/utils';
import SelectedCell from '@/assets/sprites/blocks/selected.png';

export class GameObject extends PIXI.Container {
  private color: Colors;
  private cell: Cell;
  private sprite: PIXI.Sprite;
  public selection: PIXI.Sprite;

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

    this.sprite = PIXI.Sprite.from(getSpriteByColor[color]);
    this.selection = PIXI.Sprite.from(SelectedCell);
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.sprite.width = size;
    this.sprite.height = size;

    this.selection.width = size;
    this.selection.height = size;

    this.selection.alpha = 0;
    this.selection.zIndex = 2;

    this.eventMode = 'dynamic';
    this.cursor = 'pointer';

    this.levelText = new PIXI.Text(this.getLevel(), {
      fontSize: this.sprite.width / 3,
      fontFamily: 'Titan One',
      fill: 0xffffff,
    });

    this.levelText.x = this.sprite.x + this.sprite.width / 2;
    this.levelText.y = this.sprite.y + this.sprite.height / 2;
    this.levelText.anchor.set(0.5);
    this.levelText.zIndex = 2;
    this.levelText.eventMode = 'none';
    this.addChild(this.sprite);
    this.addChild(this.levelText);
    this.addChild(this.selection);

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
    this.sprite.texture = getSpriteByColor[color];
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

  private createGameObjectGraphics(size: number) {
    const border = new PIXI.Graphics()
      .lineStyle(5, 0xffffff, 1)
      .drawRoundedRect(0, 0, size, size, 15);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(getHexColorByColor(this.color));
    graphics.drawRoundedRect(0, 0, size, size, 15);
    graphics.endFill();
    graphics.addChild(border);

    graphics.zIndex = 1;
    return graphics;
  }

  public updateSize(size: number) {
    this.x = this.cell.x * size;
    this.y = this.cell.y * size;

    this.sprite.width = size;
    this.sprite.height = size;
    this.selection.width = size;
    this.selection.height = size;
    this.levelText.style.fontSize = size / 3;
    this.levelText.x = this.sprite.x;
    this.levelText.y = this.sprite.y;
  }
}
