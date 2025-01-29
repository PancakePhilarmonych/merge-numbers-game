import * as PIXI from 'pixi.js';
import { getMaxAvailibleSideSize } from '../utils';
export default class App {
  public instance: PIXI.Application<HTMLCanvasElement>;
  public container: PIXI.Container = new PIXI.Container();

  constructor() {
    const size = getMaxAvailibleSideSize();

    this.instance = new PIXI.Application<HTMLCanvasElement>({
      antialias: true,
      backgroundAlpha: 0,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
      view: document.getElementById('app') as HTMLCanvasElement,
      width: size,
      height: size,
    });

    window.addEventListener('resize', () => {
      this.instance.renderer.resize(window.innerWidth, window.innerHeight);
  });
  }
}
