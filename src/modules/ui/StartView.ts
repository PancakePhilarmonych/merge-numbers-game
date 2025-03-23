import * as PIXI from 'pixi.js';
import { createSqareGraphics, createText } from '@/utils/graphics';
import { getMaxAvailibleSideSize } from '@/utils';

export default class StartView {
  public container: PIXI.Container = new PIXI.Container();

  constructor() {
    const sideSize = getMaxAvailibleSideSize();
    this.container.zIndex = 100;
    this.container.width = sideSize;
    this.container.height = sideSize;

    this.container.addChild(
      createSqareGraphics({
        size: sideSize,
        color: 0x2ecc71,
        transparentType: 'low',
      }),
    );
    this.container.addChild(this.createStartButton(sideSize));

    this.show();
  }

  public createStartButton(size: number) {
    const buttonWidth = size / 2;
    const buttonHeight = size / 6;
    const radius = 15;

    const startButton = new PIXI.Container();

    const border = new PIXI.Graphics()
      .lineStyle(size / 100, 0xffffff, 1)
      .drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);

    const buttonBackground = new PIXI.Graphics()
      .beginFill(0xf5cd79)
      .drawRoundedRect(3, 3, buttonWidth - 6, buttonHeight - 6, radius - 3)
      .endFill();

    startButton.addChild(border);
    startButton.addChild(buttonBackground);

    const startText = createText({
      text: 'Start',
      size: buttonHeight / 3,
    });

    startText.anchor.set(0.5);
    startText.x = buttonWidth / 2;
    startText.y = buttonHeight / 2;

    startButton.addChild(startText);

    startButton.x = (size - buttonWidth) / 2;
    startButton.y = (size - buttonHeight) / 2;

    startButton.eventMode = 'dynamic';
    startButton.cursor = 'pointer';

    startButton.on('pointerdown', () => {
      this.container.emit('mg-start', this);
    });

    return startButton;
  }

  public hide(): void {
    this.container.visible = false;
  }

  public show(): void {
    this.container.visible = true;
  }

  public resize(newSize: number): void {
    this.container.removeChildren();
    this.container.addChild(
      createSqareGraphics({
        size: newSize,
        color: 0x2ecc71,
        transparentType: 'low',
      }),
    );
    this.container.addChild(this.createStartButton(newSize));
  }
}
