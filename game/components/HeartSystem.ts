import Canvas2D from "../core/Canvas2D";
import { randomAngle, randomFloat } from "../utils/fns";
import LikeButton from "./LikeButton";
import SimulationLoop from "../interactive/SimulationLoop";
import ParticleSystem, {
  AgeFadingTheme,
  CircleGraphics,
  ConstantTheme,
  Particle,
  PositionEulerSimulator,
} from "../interactive/particles/ParticleSystem";
import Context2D from "../interactive/Context2D";

const path = new Path2D(
  "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
);
const viewbox = [0, 0, 16, 16] as const;

interface HeartParticle extends Particle {}

const simulators = [
  new PositionEulerSimulator({
    position: 32,
    velocity: {
      x: [-100, -10],
      y: [-100, -200],
    },
    acceleration: { x: [0, 50], y: 0 },
  }),
];
const graphics = new CircleGraphics(10, true);
const crimson = new ConstantTheme("crimson", null);
const age = new AgeFadingTheme(crimson);

export default class HeartSystem extends ParticleSystem<HeartParticle> {
  readonly button = new LikeButton();
  readonly canvas: Canvas2D;

  constructor(loop: SimulationLoop) {
    const canvas = new Canvas2D();
    const context = new Context2D(canvas.context);

    super(loop, context, {
      capacity: 100,
      timeout: 3,
      simulators,
      graphics,
      theme: age,
    });

    this.canvas = canvas;

    const button = this.button;

    canvas.classes = "hearts";
    button.classes = "like-button";

    button.on("click", this.onClick.bind(this));
    canvas.createResizeObserver(this.onResize.bind(this));
  }

  private onResize() {
    const dpi = window.devicePixelRatio;
    const rect = this.canvas.rect;

    const width = rect.width * dpi;
    const height = rect.height * dpi;

    this.canvas.width = width;
    this.canvas.height = height;

    this.button.calculateOriginPosition(rect.left, rect.top);

    this.loop.start();
  }

  private onClick() {
    const button = this.button;
    this.emit(button.x, button.y);
  }

  protected onUpdate() {
    super.onUpdate();

    if (Math.random() < 0.03) {
      const button = this.button;
      this.emit(button.x, button.y);
    }
  }

  protected onRender() {
    this.context.clear();
    super.onRender();
  }
}
