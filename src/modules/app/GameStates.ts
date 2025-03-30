enum States {
  RUNNING = 'RUNNING',
  OVER = 'OVER',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  LOADING = 'LOADING',
  INITIALIZING = 'INITIALIZING',
  RESETTING = 'RESETTING',
  SAVING = 'SAVING',
}

export class GameStates {
  constructor() {
    throw new Error('GameStates is a static class and cannot be instantiated');
  }

  public static currentState: States = States.INITIALIZING;

  public static isGameRunning(): boolean {
    return GameStates.currentState === States.RUNNING;
  }

  public static isGamePaused(): boolean {
    return GameStates.currentState === States.PAUSED;
  }

  public static isGameStopped(): boolean {
    return GameStates.currentState === States.STOPPED;
  }

  public static isGameInitializing(): boolean {
    return GameStates.currentState === States.INITIALIZING;
  }

  public static isGameResetting(): boolean {
    return GameStates.currentState === States.RESETTING;
  }

  public static isGameSaving(): boolean {
    return GameStates.currentState === States.SAVING;
  }

  public static isGameLoading(): boolean {
    return GameStates.currentState === States.LOADING;
  }

  public static setGameRunning(): void {
    GameStates.currentState = States.RUNNING;
  }

  public static setGamePaused(): void {
    GameStates.currentState = States.PAUSED;
  }

  public static setGameStopped(): void {
    GameStates.currentState = States.STOPPED;
  }

  public static setGameInitializing(): void {
    GameStates.currentState = States.INITIALIZING;
  }

  public static setGameResetting(): void {
    GameStates.currentState = States.RESETTING;
  }

  public static setGameSaving(): void {
    GameStates.currentState = States.SAVING;
  }

  public static setGameLoading(): void {
    GameStates.currentState = States.LOADING;
  }
}
