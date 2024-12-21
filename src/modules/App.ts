import * as PIXI from 'pixi.js';
import { getMaxAvailibleSideSize } from '../utils';
export default class App {
  public instance: PIXI.Application<HTMLCanvasElement>;

  constructor() {
    const size = getMaxAvailibleSideSize();

    this.instance = new PIXI.Application<HTMLCanvasElement>({
      antialias: true,
      backgroundAlpha: 0,
      autoDensity: true,
      view: document.getElementById('app') as HTMLCanvasElement,
      width: size,
      height: size,
    });
  }
}
