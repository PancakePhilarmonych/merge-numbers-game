import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

import red from '@/assets/sprites/blocks/red.png';
import yellow from '@/assets/sprites/blocks/yellow.png';
import blue from '@/assets/sprites/blocks/blue.png';
import empty from '@/assets/sprites/blocks/empty.png';

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

export const getSpriteByColor: Record<Colors, PIXI.Texture> = {
  [Colors.RED]: PIXI.Texture.from(red),
  [Colors.YELLOW]: PIXI.Texture.from(yellow),
  [Colors.BLUE]: PIXI.Texture.from(blue),
  [Colors.EMPTY]: PIXI.Texture.from(empty),
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
  const padding = 24;
  const sideSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
  return sideSize - padding;
};
