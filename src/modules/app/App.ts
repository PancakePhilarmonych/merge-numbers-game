import * as PIXI from 'pixi.js';
import { getMaxAvailibleSideSize } from '@/utils';
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

    this.instance.stage.addChild(this.container);
    this.initAppContainer();
  }

  public addToContainer(container: PIXI.Container | PIXI.Container[]) {
    const isContainerArray = Array.isArray(container);

    if (isContainerArray) {
      this.container.addChild(...container);
    } else {
      this.container.addChild(container);
    }
  }

  public addToStage(container: PIXI.Container) {
    this.instance.stage.addChild(container);
  }

  public resize(size: number) {
    this.instance.renderer.resize(size, size);
    this.instance.render();
  }

  private initAppContainer(): void {
    this.instance.stage.hitArea = this.instance.screen;
    this.container.sortableChildren = true;
    this.container.interactiveChildren = true;
    this.container.eventMode = 'none';
  }
}
