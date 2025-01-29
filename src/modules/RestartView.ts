import * as PIXI from 'pixi.js';

export default class RestartView extends PIXI.Container {
  public container: PIXI.Container;

  constructor(width: number, height: number) {
    super();
    this.container = new PIXI.Container();
    this.container.zIndex = 100;
    this.container.width = width;
    this.container.height = height;

    const pauseBackground = new PIXI.Graphics();
    pauseBackground.beginFill(0xff7675, 0.9);
    pauseBackground.drawRect(0, 0, width, height);
    pauseBackground.endFill();

    const restartButton = new PIXI.Graphics();
    restartButton.beginFill(0xffffff, 1);
    restartButton.drawRoundedRect(0, 0, width / 2, height / 6, 5);
    restartButton.endFill();
    restartButton.zIndex = 101;
    restartButton.x = width / 2 - restartButton.width / 2;
    restartButton.y = height / 2 - restartButton.height / 2;
    restartButton.eventMode = 'dynamic';
    restartButton.cursor = 'pointer';

    const restartText = new PIXI.Text('Restart', {
      fill: 0x000000,
      fontSize: restartButton.height / 2,
      fontFamily: 'Titan One',
      align: 'center',
    });
    restartText.zIndex = 102;

    restartText.x = restartButton.x + restartButton.width / 2 - restartText.width / 2;
    restartText.y = restartButton.y + restartButton.height / 2 - restartText.height / 2;

    this.container.addChild(pauseBackground);
    this.container.addChild(restartButton);
    this.container.addChild(restartText);
    this.container.visible = false;

    restartButton.on('pointerdown', () => this.container.emit('mg-restart', this));
  }
}
