import { noop } from "lodash";
import Context2D from "../Context2D";
import { Particle } from "./ParticleSystem";

export default interface ParticleGraphics<T extends Particle> {
  initialize?(particle: T): void;
  push?(context: Context2D, count: number): void;
  draw(context: Context2D, particle: T, t: number): void;
  pop?(context: Context2D): void;
}

export const NoGraphics: ParticleGraphics<Particle> = {
  draw: noop,
};

export class CircleGraphics implements ParticleGraphics<Particle> {
  constructor(
    radius: number | ((particle: Particle, t: number) => number),
    readonly each = false,
    readonly fill = true,
    readonly stroke = false
  ) {
    if (typeof radius === "function") {
      this.getRadius = radius;
    } else {
      this.radius = radius;
    }
  }

  draw(context: Context2D, particle: Particle, t: number) {
    const ctx = context.ctx;
    const radius = this.getRadius(particle, t);

    this.begin(ctx, this.each === true);
    this.move(ctx, this.each === false, particle.x, particle.y);
    ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    this.commit(ctx, this.each === true);
  }

  private commit(ctx: CanvasRenderingContext2D, enabled: boolean) {
    if (!enabled) return;
    if (this.fill) ctx.fill();
    if (this.stroke) ctx.stroke();
  }

  private begin(ctx: CanvasRenderingContext2D, enabled: boolean) {
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
  private getRadius(particle: Particle, t: number) {
    return this.radius;
  }
}
