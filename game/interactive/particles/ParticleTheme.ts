import { noop } from "lodash";
import Context2D, { CanvasStyle } from "../Context2D";
import { randomUint } from "../../utils/fns";
import { Particle } from "./ParticleSystem";

export default interface ParticleTheme<T extends Particle> {
  initialize?(particle: T): void;
  all?(context: Context2D, count: number): void;
  each?(context: Context2D, count: number, particle: T, t: number): void;
}

export const NoTheme: ParticleTheme<Particle> = {};

export function PaletteSelectorTheme(palette: CanvasStyle[]) {
  return {
    initialize(particle: PaletteParticle) {
      particle.theme = randomUint(0, palette.length);
    },
    each(context, _, particle) {
      context.ctx.fillStyle = palette[particle.theme];
    },
  } as ParticleTheme<PaletteParticle>;
}

export class AgeFadingTheme<T extends Particle> {
  constructor(
    readonly theme: ParticleTheme<T>,
    easing?: (t: number) => number
  ) {
    if (easing) this.easing = easing;
  }

  easing(t: number) {
    return t;
  }

  initialize() {
    this.theme.initialize?.apply(this.theme, arguments);
  }
  all() {
    this.theme.all?.apply(this.theme, arguments);
  }
  each(context: Context2D, _: number, __: T, t: number) {
    const alpha = this.easing(t);
    context.ctx.globalAlpha = 1 - alpha;
    this.theme.each?.apply(this.theme, arguments);
  }
}

export function FunctionTheme<T extends Particle>(
  fn: (context: Context2D, count: number, particle: T, t: number) => void
) {
  const all = fn.length <= 1 ? fn : noop;
  const one = all === fn ? noop : fn;

  return {
    all(context, count) {
      return all(context, count, 0);
    },
    each(context, count, particle, t) {
      return one(context, count, particle, t);
    },
  } as ParticleTheme<T>;
}

export interface PaletteParticle extends Particle {
  theme: number;
}

export class ConstantTheme implements ParticleTheme<Particle> {
  constructor(fill: CanvasStyle | null, stroke: CanvasStyle | null) {
    if (fill) this.setFillStyle = (c) => (c.fillStyle = fill);
  }

  setStrokeStyle(ctx: CanvasRenderingContext2D) {}
  setFillStyle(ctx: CanvasRenderingContext2D) {}

  all(context: Context2D, count: number) {
    const ctx = context.ctx;
    this.setFillStyle(ctx);
    this.setStrokeStyle(ctx);
  }
}
