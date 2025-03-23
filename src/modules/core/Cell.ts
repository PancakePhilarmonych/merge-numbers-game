import * as PIXI from 'pixi.js';
import EmptyField from '@/assets/sprites/grass-tile.png';
import EmptyFieldSecond from '@/assets/sprites/grass-tile-second.png';
import { GameObject } from '@/modules/core/GameObject';
import { createSqareGraphics } from '@/utils/graphics';

export default class Cell extends PIXI.Container {
  public sprite: PIXI.Sprite;
  public availibleArea: PIXI.Graphics;
  public availible: boolean = false;
  private row: number;
  private column: number;
  private gameObject: GameObject | null = null;

  private readonly AVAILABLE_AREA_PADDING_PERCENT = 20;
  private readonly CORNER_RADIUS_PERCENT = 5;

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

    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;
    this.sprite.zIndex = 1;

    this.availibleArea = createSqareGraphics({
      size,
      color: 0xffffff,
      offset: size * (this.AVAILABLE_AREA_PADDING_PERCENT / 100),
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
      transparentType: 'strong',
    });

    this.availibleArea.x = size * x;
    this.availibleArea.y = size * y;
    this.availibleArea.alpha = 0;
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

  public resize(size: number) {
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * this.column;
    this.sprite.y = size * this.row;

    const currentAlpha = this.availibleArea.alpha;

    this.removeChild(this.availibleArea);

    this.availibleArea = createSqareGraphics({
      size,
      color: 0xffffff,
      offset: size * (this.AVAILABLE_AREA_PADDING_PERCENT / 100),
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
      transparentType: 'strong',
    });
    this.availibleArea.x = size * this.column;
    this.availibleArea.y = size * this.row;

    this.availibleArea.alpha = currentAlpha;
    this.availibleArea.zIndex = 3;

    this.addChild(this.availibleArea);

    this.gameObject?.resize(size);
  }
}
