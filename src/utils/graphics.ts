import * as PIXI from 'pixi.js';

interface SqareOptions {
  size: number;
  color: PIXI.ColorSource;
  offset?: number;
  radius?: number;
  borderSize?: number;
  transparentType?: 'low' | 'medium' | 'strong';
}

interface TextOptions {
  text: string;
  size: number;
  align?: 'center' | 'left' | 'right';
}

const borderTransparencyMap = {
  low: 0.8,
  medium: 0.6,
  strong: 0.4,
};

const mainTransparencyMap = {
  low: 0.7,
  medium: 0.5,
  strong: 0.3,
};

export function createSqareGraphics(options: SqareOptions): PIXI.Graphics {
  const xStartPosition = options.offset ? 0 + options.offset / 2 : 0;
  const yStartPosition = options.offset ? 0 + options.offset / 2 : 0;
  const ofsettedSize = options.offset ? options.size - options.offset : options.size;

  const graphics = new PIXI.Graphics();
  graphics.beginFill(
    options.color,
    options.transparentType !== undefined ? mainTransparencyMap[options.transparentType] : 1,
  );
  graphics.drawRoundedRect(
    xStartPosition,
    yStartPosition,
    ofsettedSize,
    ofsettedSize,
    options.radius || 0,
  );
  graphics.endFill();

  if (options.borderSize) {
    const border = new PIXI.Graphics()
      .lineStyle(
        options.borderSize,
        '0xffffff',
        options.transparentType !== undefined ? borderTransparencyMap[options.transparentType] : 1,
      )
      .drawRoundedRect(
        xStartPosition,
        yStartPosition,
        ofsettedSize,
        ofsettedSize,
        options.radius || 0,
      );

    graphics.addChild(border);
  }

  return graphics;
}

export function createText(options: TextOptions): PIXI.Text {
  return new PIXI.Text(options.text, {
    fontSize: options.size,
    fill: 0xffffff,
    fontFamily: 'Titan One',
    align: options.align || 'center',
  });
}
