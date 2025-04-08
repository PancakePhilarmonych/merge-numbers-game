import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export enum Colors {
  RED = 'RED',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  EMPTY = 'EMPTY',
}

const mainColors = [Colors.RED, Colors.YELLOW, Colors.BLUE, Colors.EMPTY];

export const getRandomColor = (excludeEmpty = false) => {
  const colors = excludeEmpty ? mainColors.filter(color => color !== Colors.EMPTY) : mainColors;
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

export const ColorsTextMap: Record<Colors, string> = {
  [Colors.RED]: 'Red',
  [Colors.YELLOW]: 'Yellow',
  [Colors.BLUE]: 'Blue',
  [Colors.EMPTY]: 'Empty',
};

export const getHexColorByColor = (color: Colors): PIXI.ColorSource => {
  switch (color) {
    case Colors.RED:
      return 0xff7675;
    case Colors.YELLOW:
      return 0xf5cd79;
    case Colors.BLUE:
      return 0x74b9ff;
    default:
      return 0x000000;
  }
};

export const maxLevelColors = [Colors.BLUE, Colors.RED, Colors.YELLOW];

export const smoothMoveTo = (
  container: PIXI.Container,
  x: number,
  y: number,
  duration: number = 0.3,
) => {
  gsap.to(container, {
    duration,
    x,
    y,
    ease: 'power2.out',
  });
};

export function addAppListeners(instance: PIXI.Application<HTMLCanvasElement>) {
  window.addEventListener('resize', () => resizeRoot(instance), false);
}

export function resizeRoot(app: PIXI.Application<HTMLCanvasElement>) {
  const screenSize = getMaxAvailibleSideSize();
  app.renderer.resize(screenSize, screenSize);
}

export const getMaxAvailibleSideSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;

  return isLandscape ? height : width;
};
