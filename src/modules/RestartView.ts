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
    const buttonWidth = width / 2;
    const buttonHeight = height / 6;
    const radius = 15;

    const restartButton = new PIXI.Container();

    const shadow = new PIXI.Graphics();
    shadow.beginFill(0x000000, 0.3);
    shadow.drawRoundedRect(5, 5, buttonWidth, buttonHeight, radius);
    shadow.endFill();
    restartButton.addChild(shadow);

    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(0x2c3e50);
    buttonBackground.drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);
    buttonBackground.endFill();

    const gradientOverlay = new PIXI.Graphics();
    gradientOverlay.beginFill(0x34495e);
    gradientOverlay.drawRoundedRect(0, 0, buttonWidth, buttonHeight / 2, radius);
    gradientOverlay.endFill();
    gradientOverlay.alpha = 0.5;

    restartButton.addChild(buttonBackground);
    restartButton.addChild(gradientOverlay);

    restartButton.x = width / 2 - buttonWidth / 2;
    restartButton.y = height / 2 - buttonHeight / 2;
    restartButton.eventMode = 'dynamic';
    restartButton.cursor = 'pointer';

    restartButton.on('pointerdown', () => {
      this.container.emit('mg-restart', this);
    });

    return restartButton;
  }

  private createRestartText() {
    const restartText = new PIXI.Text('Restart', {
      fill: 0xffffff,
      fontSize: 50,
      fontFamily: 'Titan One',
      fontWeight: 'normal',
      align: 'center',
    });

    restartText.zIndex = 102;
    restartText.anchor.set(0.5);
    restartText.x = this.container.width / 2;
    restartText.y = this.container.height / 2;
    return restartText;
  }

  private createScoreText(width: number, height: number, score: number) {
    const scoreText = new PIXI.Text(`Score: ${score}`, {
      fill: 0xffffff,
      fontSize: 40,
      fontFamily: 'Titan One',
      align: 'center',
    });

    scoreText.anchor.set(0.5);
    scoreText.x = width / 2;
    scoreText.y = height / 3;

    return scoreText;
  }

  public setScoreText(width: number, height: number, score: number) {
    this.container.removeChild(this.container.children[3]);
    this.container.addChild(this.createScoreText(width, height, score));
  }

  public show() {
    this.container.visible = true;
  }

  public hide() {
    this.container.visible = false;
  }
}
