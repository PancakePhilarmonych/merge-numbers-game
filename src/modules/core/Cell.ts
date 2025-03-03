import * as PIXI from 'pixi.js';
import EmptyField from '@/assets/sprites/grass-tile.png';
import EmptyFieldSecond from '@/assets/sprites/grass-tile-second.png';
import { GameObject } from '@/modules/core/GameObject';

export default class Cell extends PIXI.Container {
  public sprite: PIXI.Sprite;
  public availibleArea: PIXI.Graphics;
  public availible: boolean = false;
  private row: number;
  private column: number;
  private gameObject: GameObject | null = null;

  constructor(x: number, y: number, size: number) {
    super();
    this.column = x;
    this.row = y;

    const cellCount = x + y;
    if (cellCount % 2 === 0) {
      this.sprite = PIXI.Sprite.from(EmptyField);
    } else {
      this.sprite = PIXI.Sprite.from(EmptyFieldSecond);
    }

    const offset = 30;

    const border = new PIXI.Graphics()
      .lineStyle(10, 0xffffff, 0.3)
      .drawRoundedRect(0 + offset / 2, 0 + offset / 2, size - offset, size - offset, 15);

    this.availibleArea = new PIXI.Graphics();
    this.availibleArea.beginFill(0xffffff, 0.5);
    this.availibleArea.drawRoundedRect(
      0 + offset / 2,
      0 + offset / 2,
      size - offset,
      size - offset,
      15,
    );
    this.availibleArea.endFill();
    this.availibleArea.addChild(border);

    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;

    this.availibleArea.x = size * x;
    this.availibleArea.y = size * y;
    this.availibleArea.alpha = 0;

    this.sprite.zIndex = 1;
    this.availibleArea.zIndex = 3;

    this.addChild(this.sprite);
    this.addChild(this.availibleArea);
  }

  get x() {
    return this.column;
  }

  get y() {
    return this.row;
  }

  getGameObject() {
    return this.gameObject;
  }

  setAvailible() {
    this.availible = true;
    this.availibleArea.alpha = 1;
  }

  removeAvailible() {
    this.availible = false;
    this.availibleArea.alpha = 0;
  }

  setGameObject(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

  removeGameObject() {
    this.gameObject = null;
  }

  public updateSize(size: number) {
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * this.column;
    this.sprite.y = size * this.row;

    this.availibleArea.width = size;
    this.availibleArea.height = size;
    this.availibleArea.x = size * this.column;
    this.availibleArea.y = size * this.row;

    this.gameObject?.updateSize(size);
  }
}
