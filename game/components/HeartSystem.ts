import Canvas2D from "../core/Canvas2D";
import { randomAngle, randomFloat } from "../utils/fns";
import App from "./App";

const HEART_FILL =
  "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z";
const HEART_VIEWBOX = [0, 0, 16, 16] as const;

export default class HeartSystem {
  readonly path = new Path2D(HEART_FILL);

  private particles = new Set<HeartParticle>();
  private pool: HeartParticle[] = [];

  private canvas: Canvas2D;

  constructor(
    app: App,
    readonly capacity: number,
    readonly maxAgeInSeconds: number
  ) {
    this.canvas = app.canvas;

    app.likeBtn.on("click", () => {
      const { x, y } = app.likeBtn;
      this.emit(x, y);
    });

    this.canvas.createResizeObserver((e) => {
      // prettier-ignore
      const [{ contentRect: { width, height } }]= e;
      this.canvas.width = width;
      this.canvas.height = height;
    });

    app.loop.onUpdate(() => {
      for (const particle of this.particles) {
        if (particle.age > this.maxAgeInSeconds) {
          this.particles.delete(particle);
          this.pool.push(particle);
        }
      }

      console.log(this.particles.size);
    });

    app.loop.onTick((step) => {
      this.tick(step);
    });

    app.loop.onRender(() => {
      this.draw();
    });

    app.loop.start();
  }

  emit(x: number, y: number) {
    if (this.particles.size >= this.capacity) return;

    const particle = this.pool.pop() ?? new HeartParticle();

    const angle = randomAngle();

    particle.reset(x, y, -30, 10, -100, -50, -angle, angle);

    this.particles.add(particle);
  }

  tick(dt: number) {
    for (const particle of this.particles) {
      particle.tick(dt);
    }
  }

  draw() {
    const { particles, canvas, path } = this;
    const ctx = canvas.context;

    canvas.clear();

    ctx.save();
    ctx.fillStyle = "crimson";
    for (const particle of particles) {
      ctx.globalAlpha = 1 - particle.age / this.maxAgeInSeconds;
      canvas.fillPath2D(
        path,
        HEART_VIEWBOX,
        particle.x,
        particle.y,
        particle.r
      );
    }
    ctx.restore();
  }
}

class HeartParticle {
  age = 0;

  x = 0;
  y = 0;

  r = 0;

  vx = 0;
  vy = 0;

  vr = 0;

  tick(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.r += this.vr * dt;
    this.age += dt;
  }

  reset(
    x: number,
    y: number,
    vxMin: number,
    vxMax: number,
    vyMin: number,
    vyMax: number,
    vrMin: number,
    vrMax: number
  ) {
    this.age = 0;

    this.x = x;
    this.y = y;
    this.r = randomAngle();

    this.vx = randomFloat(vxMin, vxMax);
    this.vy = randomFloat(vyMin, vyMax);
    this.vr = randomFloat(vrMin, vrMax);
  }
}
