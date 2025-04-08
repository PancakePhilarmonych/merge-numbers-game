import * as PIXI from 'pixi.js';

export default class ScorePanel extends PIXI.Container {
  private scoreText: PIXI.Text;
  private score: number = 0;

  constructor() {
    super();
    this.scoreText = new PIXI.Text(`Score: ${this.score}`, {
      fontSize: '32px',
      fontWeight: 'normal',
      fontFamily: 'Titan One',
      fill: '#ffffff',
    });

    this.scoreText.x = 20;
    this.scoreText.y = 20;

    this.addChild(this.scoreText);
  }

  public setScore(score: number) {
    this.score = score;
    this.scoreText.text = `Score: ${this.score}`;
  }
}
