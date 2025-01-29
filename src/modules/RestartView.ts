import * as PIXI from 'pixi.js';

export default class RestartView extends PIXI.Container {
  public container: PIXI.Container;

  constructor(width: number, height: number) {
    super();
    this.container = new PIXI.Container();
    this.container.zIndex = 100;
    this.container.width = width;
    this.container.height = height;

    this.container.addChild(this.createPauseBackground(width, height));
    this.container.addChild(this.createRestartButton(width, height));
    this.container.addChild(this.createRestartText());
    this.container.visible = false;
  }

  private createPauseBackground(width: number, height: number) {
    const pauseBackground = new PIXI.Graphics();
    pauseBackground.beginFill(0xff7675, 0.9);
    pauseBackground.drawRect(0, 0, width, height);
    pauseBackground.endFill();

    return pauseBackground;
  }

  private createRestartButton(width: number, height: number) {
    const restartButton = new PIXI.Graphics();
    restartButton.beginFill(0xffffff, 1);
    restartButton.drawRoundedRect(0, 0, width / 2, height / 6, 5);
    restartButton.endFill();
    restartButton.zIndex = 101;
    restartButton.x = width / 2 - restartButton.width / 2;
    restartButton.y = height / 2 - restartButton.height / 2;
    restartButton.eventMode = 'dynamic';
    restartButton.cursor = 'pointer';

    restartButton.on('pointerdown', () => this.container.emit('mg-restart', this));

    return restartButton;
  }

  private createRestartText() {
    const restartText = new PIXI.Text('Restart', {
      fill: 0x000000,
      fontSize: 50,
      fontFamily: 'Titan One',
      align: 'center',
    });

    restartText.zIndex = 102;
    restartText.anchor.set(0.5);
    restartText.x = this.container.width / 2;
    restartText.y = this.container.height / 2;
    return restartText;
  }
}
