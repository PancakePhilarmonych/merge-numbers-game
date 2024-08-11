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

  public static curentState: States = States.INITIALIZING;

  public static isGameRunning(): boolean {
    return GameStates.curentState === States.RUNNING;
  }

  public static isGamePaused(): boolean {
    return GameStates.curentState === States.PAUSED;
  }

  public static isGameStopped(): boolean {
    return GameStates.curentState === States.STOPPED;
  }

  public static isGameInitializing(): boolean {
    return GameStates.curentState === States.INITIALIZING;
  }

  public static isGameResetting(): boolean {
    return GameStates.curentState === States.RESETTING;
  }

  public static isGameSaving(): boolean {
    return GameStates.curentState === States.SAVING;
  }

  public static isGameLoading(): boolean {
    return GameStates.curentState === States.LOADING;
  }

  public static setGameRunning(): void {
    GameStates.curentState = States.RUNNING;
  }

  public static setGamePaused(): void {
    GameStates.curentState = States.PAUSED;
  }

  public static setGameStopped(): void {
    GameStates.curentState = States.STOPPED;
  }

  public static setGameInitializing(): void {
    GameStates.curentState = States.INITIALIZING;
  }

  public static setGameResetting(): void {
    GameStates.curentState = States.RESETTING;
  }

  public static setGameSaving(): void {
    GameStates.curentState = States.SAVING;
  }

  public static setGameLoading(): void {
    GameStates.curentState = States.LOADING;
  }
}
