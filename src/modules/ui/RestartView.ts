import * as PIXI from 'pixi.js';
import { createSqareGraphics } from '@/utils/graphics';

export default class RestartView extends PIXI.Container {
  public container: PIXI.Container;

  constructor(size: number) {
    super();
    this.container = new PIXI.Container();
    this.container.zIndex = 100;
    this.container.width = size;
    this.container.height = size;

    this.container.addChild(
      createSqareGraphics({
        size,
        color: 0xff7675,
        transparentType: 'low',
      }),
    );
    this.container.addChild(this.createRestartButton(size));
    this.container.addChild(this.createRestartText());
    this.container.visible = false;
  }

  private createRestartButton(size: number) {
    const buttonWidth = size / 2;
    const buttonHeight = size / 6;
    const radius = 15;

    const restartButton = new PIXI.Container();

    const border = new PIXI.Graphics()
      .lineStyle(size / 100, 0xffffff, 1)
      .drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);

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

  private createScoreText(score: number) {
    const scoreText = new PIXI.Text(`Score: ${score}`, {
      fill: 0xffffff,
      fontSize: 50,
      fontFamily: 'Titan One',
      align: 'center',
    });

    scoreText.anchor.set(0.5);
    scoreText.x = this.container.width / 2;
    scoreText.y = this.container.height / 3;

    return scoreText;
  }

  private createBestScoreText(bestScore: number) {
    const bestScoreText = new PIXI.Text(`Best score: ${bestScore}`, {
      fill: 0xffffff,
      fontSize: 30,
      fontFamily: 'Titan One',
      align: 'center',
    });

    bestScoreText.anchor.set(0.5);
    bestScoreText.x = this.container.width / 2;
    bestScoreText.y = this.container.height / 4;

    return bestScoreText;
  }

  public setScoreText(score: number, bestScoreText: number) {
    this.container.removeChild(this.container.children[3]);
    this.container.removeChild(this.container.children[4]);
    this.container.addChild(this.createBestScoreText(bestScoreText));
    this.container.addChild(this.createScoreText(score));
  }

  public show() {
    this.container.visible = true;
  }

  public hide() {
    this.container.visible = false;
  }

  public resize(newSize: number): void {
    const bestScoreText = this.container.children[3] as PIXI.Text;
    const scoreText = this.container.children[4] as PIXI.Text;
    const hasBestScore = this.container.children.length > 3;

    this.container.removeChildren();
    this.container.addChild(
      createSqareGraphics({
        size: newSize,
        color: 0xff7675,
        transparentType: 'low',
      }),
    );
    this.container.addChild(this.createRestartButton(newSize));
    this.container.addChild(this.createRestartText());

    if (hasBestScore) {
      this.container.addChild(
        this.createBestScoreText(parseInt(bestScoreText.text.split(' ')[2], 10)),
      );
      this.container.addChild(this.createScoreText(parseInt(scoreText.text.split(' ')[1], 10)));
    }
  }
}
