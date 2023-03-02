import { noop, random } from "lodash";
import Context2D, { TranformOption, TransformTuple } from "../Context2D";
import { Particle } from "./ParticleSystem";

export default interface ParticleGraphics<T extends Particle> {
  initialize?(particle: T, option: unknown): void;
  push?(context: Context2D, count: number): void;
  draw(context: Context2D, particle: T, t: number): void;
  pop?(context: Context2D): void;
}

export const NoGraphics: ParticleGraphics<Particle> = {
  draw: noop,
};

export class CircleGraphics implements ParticleGraphics<Particle> {
  constructor(
    radius:
      | number
      | ((particle: Particle, option: unknown) => number)
      | [
          (particle: Particle, option: unknown) => void,
          (particle: Particle, t: number) => number
        ],
    readonly each = false,
    readonly fill = true,
    readonly stroke = false
  ) {
    if (typeof radius === "function") {
      this.getRadius;
    } else if (Array.isArray(radius)) {
      this.initialize = radius[0];
      this.getRadius = radius[1];
    } else {
      this.radius = radius;
    }
  }

  initialize(particle: Particle, option: unknown): void {}

  draw(context: Context2D, particle: Particle, t: number) {
    const ctx = context.ctx;
    const radius = this.getRadius(particle, t);

    this.begin(ctx, this.each === true);
    this.move(ctx, this.each === false, particle.x, particle.y);
    ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    this.commit(ctx, this.each === true);
  }

  protected commit(ctx: CanvasRenderingContext2D, enabled: boolean) {
    if (!enabled) return;
    if (this.fill) ctx.fill();
    if (this.stroke) ctx.stroke();
  }

  protected begin(ctx: CanvasRenderingContext2D, enabled: boolean) {
    if (!enabled) return;
    ctx.beginPath();
  }

  private move(
    ctx: CanvasRenderingContext2D,
    enabled: boolean,
    x: number,
    y: number
  ) {
    if (!enabled) return;
    ctx.moveTo(x, y);
  }

  push(context: Context2D) {
    this.begin(context.ctx, this.each === false);
  }

  pop(context: Context2D) {
    this.commit(context.ctx, this.each === false);
  }

  private radius = 0;
  private getRadius(_particle: Particle, _t: number) {
    return this.radius;
  }
}

interface PathParticleExt {
  s?: number;
  sx?: number;
  sy?: number;
  ox?: number;
  oy?: number;
}

type PathParticle = Particle & PathParticleExt;

export class PathParticleGraphics implements ParticleGraphics<PathParticle> {
  constructor(
    readonly path: Path2D,
    readonly viewbox: readonly [x: number, y: number, w: number, h: number],
    readonly transform: TransformTuple | TranformOption = [0, 0, 0, 1, 1],
    readonly fill = true,
    readonly stroke = false
  ) {}

  draw(context: Context2D, particle: Particle): void {
    const pr = particle.r;
    const ps = particle.s ?? 1;
    const psx = particle.sx ?? ps;
    const psy = particle.sy ?? ps;
    const pox = particle.ox ?? 0;
    const poy = particle.oy ?? 0;

    const [tx, ty, r, sx, sy] = TransformTuple.toFull(this.transform);

    context.drawPath2D(
      this.path,
      this.fill,
      this.stroke,
      [tx + pox, ty + poy, r + pr, sx * psx, sy * psy],
      ...this.viewbox,
      particle.x,
      particle.y
    );
  }
}
