import * as PIXI from 'pixi.js';

export default class RestartView extends PIXI.Container {
  public container: PIXI.Container;

  constructor(size: number) {
    super();
    this.container = new PIXI.Container();
    this.container.zIndex = 100;
    this.container.width = size;
    this.container.height = size;

    this.container.addChild(this.createPauseBackground(size));
    this.container.addChild(this.createRestartButton(size));
    this.container.addChild(this.createRestartText());
    this.container.visible = false;
  }

  private createPauseBackground(size: number) {
    const pauseBackground = new PIXI.Graphics();
    pauseBackground.beginFill(0xff7675, 0.9);
    pauseBackground.drawRect(0, 0, size, size);
    pauseBackground.endFill();

    return pauseBackground;
  }

  private createRestartButton(size: number) {
    const buttonWidth = size / 2;
    const buttonHeight = size / 6;
    const radius = 15;

    const restartButton = new PIXI.Container();

    const border = new PIXI.Graphics()
      .lineStyle(10, 0xffffff, 1)
      .drawRoundedRect(-3, -3, buttonWidth + 6, buttonHeight + 6, radius);

    restartButton.addChild(border);

    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(0xf5cd79);
    buttonBackground.drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);
    buttonBackground.endFill();

    restartButton.addChild(buttonBackground);

    restartButton.x = size / 2 - buttonWidth / 2;
    restartButton.y = size / 2 - buttonHeight / 2;
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
      fontSize: 50,
      fontFamily: 'Titan One',
      align: 'center',
    });

    scoreText.anchor.set(0.5);
    scoreText.x = width / 2;
    scoreText.y = height / 3;

    return scoreText;
  }

  private createBestScoreText(width: number, height: number, bestScore: number) {
    const bestScoreText = new PIXI.Text(`Best score: ${bestScore}`, {
      fill: 0xffffff,
      fontSize: 30,
      fontFamily: 'Titan One',
      align: 'center',
    });

    bestScoreText.anchor.set(0.5);
    bestScoreText.x = width / 2;
    bestScoreText.y = height / 4;

    return bestScoreText;
  }

  public setScoreText(width: number, height: number, score: number, bestScoreText: number) {
    this.container.removeChild(this.container.children[3]);
    this.container.removeChild(this.container.children[4]);
    this.container.addChild(this.createBestScoreText(width, height, bestScoreText));
    this.container.addChild(this.createScoreText(width, height, score));
  }

  public show() {
    this.container.visible = true;
  }

  public hide() {
    this.container.visible = false;
  }

  public resize(): void {}
}
