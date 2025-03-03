import * as PIXI from 'pixi.js';

export default class StartView {
  public container: PIXI.Container = new PIXI.Container();

  constructor(size: number) {
    this.container.zIndex = 100;
    this.container.width = size;
    this.container.height = size;

    this.container.addChild(this.createStartBackground(size));
    this.container.addChild(this.createStartButton(size));
  }

  private createStartBackground(size: number) {
    const startBackground = new PIXI.Graphics();
    startBackground.beginFill(0x2ecc71, 0.9);
    startBackground.drawRect(0, 0, size, size);
    startBackground.endFill();

    return startBackground;
  }

  public createStartButton(size: number) {
    const buttonWidth = size / 2;
    const buttonHeight = size / 6;
    const radius = 15;

    const startButton = new PIXI.Container();

    const border = new PIXI.Graphics()
      .lineStyle(10, 0xffffff, 1)
      .drawRoundedRect(-3, -3, buttonWidth + 6, buttonHeight + 6, radius);

    const buttonBackground = new PIXI.Graphics()
      .beginFill(0xf5cd79)
      .drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius)
      .endFill();

    startButton.addChild(border);
    startButton.addChild(buttonBackground);

    const startText = new PIXI.Text('Start', {
      fill: 0xffffff,
      fontSize: buttonHeight / 3,
      fontWeight: 'bold',
      fontFamily: 'Titan One',
      align: 'center',
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

  public resize(): void {}
}
