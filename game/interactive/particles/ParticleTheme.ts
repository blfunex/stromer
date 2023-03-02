import { noop } from "lodash";
import Context2D, { CanvasStyle } from "../Context2D";
import { randomUint } from "../../utils/utils";
import { Particle } from "./ParticleSystem";

export default interface ParticleTheme<T extends Particle> {
  initialize?(particle: T, option: unknown): void;
  all?(context: Context2D, count: number): void;
  each?(context: Context2D, count: number, particle: T, t: number): void;
}

export const NoTheme: ParticleTheme<Particle> = {};

type PaletteFn = (
  palette: CanvasStyle[],
  option: unknown,
  random: (palette: CanvasStyle[]) => number,
  particle: Particle
) => number;

export class PaletteSelectorTheme implements ParticleTheme<Particle> {
  constructor(readonly palette: CanvasStyle[], chooseTheme?: PaletteFn) {
    this.chooseRandomTheme = this.chooseRandomTheme.bind(this);
    this.chooseTheme = chooseTheme ?? this.chooseRandomTheme;
  }

  private chooseRandomTheme(palette: CanvasStyle[]) {
    return randomUint(palette.length);
  }

  chooseTheme: PaletteFn = this.chooseRandomTheme;

  initialize(particle: PaletteParticle, option: unknown) {
    const index = this.chooseTheme(
      this.palette,
      option,
      this.chooseRandomTheme,
      particle
    );

    particle.theme = index;
  }

  each(context, _, particle) {
    context.ctx.fillStyle = this.palette[particle.theme];
  }
}

export class AgeFadingTheme<T extends Particle> {
  constructor(
    readonly theme: ParticleTheme<T>,
    easing?: (t: number) => number,
    initialize?: (particle: T, option: unknown) => void,
    predicate?: (particle: T, t: number) => boolean
  ) {
    if (easing) this.easing = easing;
    if (predicate) this.predicate = predicate;
    if (initialize) this.init = initialize;
  }

  init(particle: T, option: unknown) {}

  easing(t: number) {
    return t;
  }

  predicate(particle: T, t: number) {
    return true;
  }

  initialize(particle: T, option: unknown) {
    this.init(particle, option);
    this.theme.initialize?.apply(this.theme, arguments);
  }
  all() {
    this.theme.all?.apply(this.theme, arguments);
  }
  each(context: Context2D, _: number, predicate: T, t: number) {
    if (this.predicate(predicate, t)) {
      const alpha = this.easing(t);
      context.ctx.globalAlpha = 1 - alpha;
    }
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
