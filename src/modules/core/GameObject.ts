import * as PIXI from 'pixi.js';
import Cell from '@/modules/core/Cell';
import { Colors, getHexColorByColor } from '@/utils';
import { createSqareGraphics, createText } from '@/utils/graphics';

export class GameObject extends PIXI.Container {
  private color: Colors;
  private cell: Cell;
  private sprite: PIXI.Graphics;
  public selection: PIXI.Graphics;

  public level: number = 1;
  public levelText: PIXI.Text;

  private readonly OBJECT_PADDING_PERCENT = 40;
  private readonly SELECTION_PADDING_PERCENT = 20;

  constructor(cell: Cell, color: Colors, size: number) {
    const [x, y] = [cell.x, cell.y];

    super();
    this.cell = cell;
    this.color = color;
    this.position = { x, y };

    this.x = size * x;
    this.y = size * y;
    this.zIndex = 1;

    const objectOffset = size * (this.OBJECT_PADDING_PERCENT / 100);
    const selectionOffset = size * (this.SELECTION_PADDING_PERCENT / 100);

    this.sprite = createSqareGraphics({
      size,
      offset: objectOffset,
      color: getHexColorByColor(this.color),
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
    });

    this.selection = createSqareGraphics({
      size,
      offset: selectionOffset,
      color: 0xffffff,
      transparentType: 'medium',
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
    });

    this.selection.alpha = 0;
    this.selection.zIndex = 2;

    this.eventMode = 'dynamic';
    this.cursor = 'pointer';

    this.levelText = createText({
      text: String(this.getLevel()),
      size: this.sprite.width / 3,
    });

    this.levelText.eventMode = 'none';

    this.positionLevelText(size, objectOffset);

    this.sprite.addChild(this.levelText);
    this.addChild(this.selection);
    this.addChild(this.sprite);

    this.on('pointerdown', this.onPointedDown, this);
    cell.setGameObject(this);
  }

  private positionLevelText(size: number, offset: number) {
    this.levelText.anchor.set(0.5);

    const spriteWidth = size - offset;
    const spriteHeight = size - offset;
    const offsetHalf = offset / 2;

    this.levelText.x = offsetHalf + spriteWidth / 2;
    this.levelText.y = offsetHalf + spriteHeight / 2;
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

  public resize(size: number) {
    this.x = this.cell.x * size;
    this.y = this.cell.y * size;

    const objectOffset = size * (this.OBJECT_PADDING_PERCENT / 100);
    const selectionOffset = size * (this.SELECTION_PADDING_PERCENT / 100);

    this.removeChild(this.sprite);
    this.removeChild(this.selection);

    this.sprite = createSqareGraphics({
      size,
      offset: objectOffset,
      color: getHexColorByColor(this.color),
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
    });

    this.selection = createSqareGraphics({
      size,
      offset: selectionOffset,
      color: 0xffffff,
      transparentType: 'medium',
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
    });

    this.selection.alpha = 0;
    this.selection.zIndex = 2;

    this.levelText.style.fontSize = this.sprite.width / 3;

    this.positionLevelText(size, objectOffset);

    this.sprite.addChild(this.levelText);
    this.addChild(this.selection);
    this.addChild(this.sprite);
  }
}
