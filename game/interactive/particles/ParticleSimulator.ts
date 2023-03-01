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
  export function parseUnit(range: RangeMinMax): RangeUnit {
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
    return [randomUnit(x), randomUnit(y)] as RangeUnit;
  }

  export function randomUnit(range: RangeUnit) {
    const [min, max] = range;
    return randomFloat(min, max);
  }
}

export class PositionEulerSimulator implements ParticleSimulator<Particle> {
  constructor({
    position = 0,
    velocity = 0,
    acceleration = 0,
    rotation = [0, 2 * Math.PI],
    angularVelocity = 0,
  }: {
    position?: RangeXY;
    velocity?: RangeXY;
    acceleration?: RangeXY;
    rotation?: RangeMinMax;
    angularVelocity?: RangeMinMax;
  } = {}) {
    this.position = Range.parse(position);
    this.velocity = Range.parse(velocity);
    this.acceleration = Range.parse(acceleration);
    this.rotation = Range.parseUnit(rotation);
    this.anglarVelocity = Range.parseUnit(angularVelocity);
  }

  private position: [RangeUnit, RangeUnit];
  private velocity: [RangeUnit, RangeUnit];
  private acceleration: [RangeUnit, RangeUnit];
  private rotation: RangeUnit;
  private anglarVelocity: RangeUnit;

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
