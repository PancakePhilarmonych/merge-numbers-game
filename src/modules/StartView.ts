import * as PIXI from 'pixi.js';

export default class StartView {
  public container: PIXI.Container = new PIXI.Container();

  constructor(width: number, height: number) {
    this.container.zIndex = 100;
    this.container.width = width;
    this.container.height = height;

    this.container.addChild(this.createStartBackground(width, height));
    this.container.addChild(this.createStartButton(width, height));
  }

  private createStartBackground(width: number, height: number) {
    const startBackground = new PIXI.Graphics();
    startBackground.beginFill(0x2ecc71, 0.9);
    startBackground.drawRect(0, 0, width, height);
    startBackground.endFill();

    return startBackground;
  }

  public createStartButton(width: number, height: number) {
    const buttonWidth = width / 2;
    const buttonHeight = height / 6;
    const radius = 15;

    const startButton = new PIXI.Container();

    const border = new PIXI.Graphics()
      .lineStyle(6, 0xffffff, 1)
      .drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);

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

    startButton.x = (width - buttonWidth) / 2;
    startButton.y = (height - buttonHeight) / 2;

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
