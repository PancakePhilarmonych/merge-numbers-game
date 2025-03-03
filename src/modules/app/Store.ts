export default class Store {
  private currentScore: number;
  private bestScore: number;

  constructor() {
    this.currentScore = 0;
    const bestFromStorage = localStorage.getItem('best');

    if (bestFromStorage) {
      this.bestScore = parseInt(bestFromStorage);
    } else {
      this.bestScore = 0;
    }
  }

  public incrementScore(n?: number) {
    n ? (this.currentScore += n) : this.currentScore++;
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
      localStorage.setItem('best', this.currentScore.toString());
    }
  }

  public reset() {
    this.currentScore = 0;

    const bestFromStorage = localStorage.getItem('best');
    if (bestFromStorage) {
      this.bestScore = parseInt(bestFromStorage);
    }
  }

  public getScore() {
    return this.currentScore;
  }

  public getBestScore() {
    return this.bestScore;
  }

  public setBestScore(score: number) {
    this.bestScore = score;
  }
}
