import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

import red from '../assets/sprites/blocks/red.png';
import yellow from '../assets/sprites/blocks/yellow.png';
import blue from '../assets/sprites/blocks/blue.png';
import empty from '../assets/sprites/blocks/empty.png';

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
  const isLandscape = window.innerWidth > window.innerHeight;
  const CANVAS_PADDING = isLandscape ? 24 : 0;
  const root = document.getElementById('app')! as HTMLDivElement;
  const sideSize = root.offsetWidth > root.offsetHeight ? root.offsetHeight : root.offsetWidth;
  return sideSize - CANVAS_PADDING;
};
