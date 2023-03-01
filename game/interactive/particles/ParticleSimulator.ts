import { randomFloat } from "../../utils/fns";
import { Particle } from "./ParticleSystem";

export default interface ParticleSimulator<T extends Particle> {
  initialize(particle: T): void;
  tick(particle: T, dt: number): void;
  lerp(particle: T, t: number): void;
}

type RangeMinMax =
  | number
  | [min: number, max: number]
  | { min: number; max: number };
type RangeXY =
  | number
  | [x: RangeMinMax, y?: RangeMinMax]
  | { x: RangeMinMax; y: RangeMinMax };

type RangeUnit = [min: number, max: number];
type Range = [x: RangeUnit, y: RangeUnit];

namespace Range {
  function parseUnit(range: RangeMinMax): RangeUnit {
    return typeof range === "number"
      ? [-range, range]
      : Array.isArray(range)
      ? range
      : [range.min, range.max];
  }

  export function parse(r: RangeXY): Range {
    r = typeof r === "number" ? [r, r] : Array.isArray(r) ? r : [r.x, r.y];
    const [x, y = x] = r.map(parseUnit);
    return [x, y];
  }

  export function scale(range: Range, scale: number) {
    range[0][0] *= scale;
    range[0][1] *= scale;
    range[1][0] *= scale;
    range[1][1] *= scale;
  }

  export function random(range: Range) {
    const [x, y] = range;
    const [xMin, xMax] = x;
    const [yMin, yMax] = y;

    return [randomFloat(xMin, xMax), randomFloat(yMin, yMax)] as RangeUnit;
  }
}

export class PositionEulerSimulator implements ParticleSimulator<Particle> {
  constructor({
    position = 0,
    velocity = 0,
    acceleration = 0,
  }: {
    position?: RangeXY;
    velocity?: RangeXY;
    acceleration?: RangeXY;
  } = {}) {
    this.position = Range.parse(position);
    this.velocity = Range.parse(velocity);
    this.acceleration = Range.parse(acceleration);
  }

  private position: [RangeUnit, RangeUnit];
  private velocity: [RangeUnit, RangeUnit];
  private acceleration: [RangeUnit, RangeUnit];

  scale(scale: number) {
    Range.scale(this.position, scale);
    Range.scale(this.velocity, scale);
    Range.scale(this.acceleration, scale);
  }

  initialize(particle: Particle) {
    const [px, py] = Range.random(this.position);
    const [vx, vy] = Range.random(this.velocity);
    const [ax, ay] = Range.random(this.acceleration);

    particle.x += px;
    particle.y += py;
    particle.vx += vx;
    particle.vy += vy;
    particle.ax = ax;
    particle.ay = ay;
  }

  tick(particle: Particle, dt: number) {
    particle.vx += particle.ax * dt;
    particle.vy += particle.ay * dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
  }

  lerp() {}
}
