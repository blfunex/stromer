import Context2D, { toMargins, Margins, MarginsOptions } from "../Context2D";
import SimulationLoop from "../SimulationLoop";
import ParticleSimulator from "./ParticleSimulator";
import ParticleGraphics, { NoGraphics } from "./ParticleGraphics";
import ParticleTheme, { NoTheme } from "./ParticleTheme";

export * from "./ParticleGraphics";
export * from "./ParticleTheme";
export * from "./ParticleSimulator";

export default class ParticleSystem<T extends Particle> {
  private particles = new Set<T>();
  private pool: T[] = [];

  private theme: ParticleTheme<T>;
  private graphics: ParticleGraphics<T>;
  private capacity: number;
  private timeout: number;
  private rate: number;
  private margins: Margins;
  private simulators: ParticleSimulator<T>[];

  constructor(
    readonly loop: SimulationLoop,
    readonly context: Context2D,
    {
      capacity = 100,
      timeout = 10,
      margins = 0,
      theme = NoTheme,
      graphics = NoGraphics,
      rate = 1,
      simulators = [],
    }: {
      capacity?: number;
      timeout?: number;
      rate?: number;
      margins?: MarginsOptions;
      theme?: ParticleTheme<T>;
      graphics?: ParticleGraphics<T>;
      simulators?: ParticleSimulator<T>[];
    } = {}
  ) {
    this.capacity = capacity;
    this.timeout = timeout;
    this.margins = toMargins(margins);
    this.theme = theme;
    this.graphics = graphics;
    this.rate = rate;
    this.simulators = simulators;
    loop.onUpdate(this.onUpdate.bind(this));
    loop.onTick(this.onTick.bind(this));
    loop.onRender(this.onRender.bind(this));
  }

  emit(x: number, y: number) {
    for (let i = 0; i < this.rate; i++) {
      this.emitOnce(x, y);
    }
    this.loop.start();
  }

  private emitOnce(x: number, y: number) {
    if (this.particles.size >= this.capacity) return;

    const particle = this.pool.pop() ?? ({} as T);

    particle.age = 0;
    particle.x = x;
    particle.y = y;
    particle.vx = 0;
    particle.vy = 0;
    particle.r = 0;

    for (const simulator of this.simulators) {
      simulator.initialize(particle);
    }

    this.particles.add(particle);
  }

  protected onTick(dt: number) {
    for (const simulator of this.simulators) {
      for (const particle of this.particles) {
        simulator.tick(particle, dt);
        particle.age += dt;
      }

      for (const particle of this.particles) {
        simulator.lerp(particle, particle.age / this.timeout);
      }
    }
  }

  protected onUpdate() {
    const timeout = this.timeout;
    const { width, height } = this.context;
    const [top, right, bottom, left] = this.margins;

    const minX = -left;
    const minY = -top;
    const maxX = width + right;
    const maxY = height + bottom;

    for (const particle of this.particles) {
      if (isDead(particle.age) || isOutOfBounds(particle.x, particle.y)) {
        this.particles.delete(particle);
        this.pool.push(particle);
      }
    }

    function isDead(age: number) {
      return age > timeout;
    }

    function isOutOfBounds(x: number, y: number) {
      return x < minX || x > maxX || y < minY || y > maxY;
    }
  }

  protected onRender() {
    const context = this.context;
    const count = this.particles.size;
    const timeout = this.timeout;

    this.theme.all?.(context, count);
    this.graphics.push?.(context, count);
    for (const particle of this.particles) {
      const easing = particle.age / timeout;
      this.theme.each?.(context, count, particle, easing);
      this.graphics.draw(context, particle, easing);
    }
    this.graphics.pop?.(context);
  }
}

interface ParticleStruct {
  [key: string]: number;
}

export interface Particle extends ParticleStruct {
  age: number;

  x: number;
  y: number;

  vx: number;
  vy: number;

  r: number;
}
