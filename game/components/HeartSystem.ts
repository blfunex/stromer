import Canvas2D from "../core/Canvas2D";
import LikeButton, { HEART_FILL_ICON, HEART_OUTLINE_ICON } from "./LikeButton";
import SimulationLoop from "../interactive/SimulationLoop";
import ParticleSystem, {
  AgeFadingTheme,
  CircleGraphics,
  ConstantTheme,
  Particle,
  PathParticleGraphics,
  PositionEulerSimulator,
} from "../interactive/particles/ParticleSystem";
import Context2D from "../interactive/Context2D";

const path = new Path2D(HEART_FILL_ICON.path);
const viewbox = HEART_FILL_ICON.viewbox;

interface HeartParticle extends Particle {}

const simulators = [
  new PositionEulerSimulator({
    position: 32,
    velocity: {
      x: [-100, -10],
      y: [-100, -200],
    },
    acceleration: { x: [0, 50], y: 0 },
    angularVelocity: Math.PI,
  }),
];

const graphics = new PathParticleGraphics(path, viewbox, { scale: 2 });
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
    console.log("click");
    const button = this.button;
    this.emit(button.x, button.y);
  }

  protected onUpdate() {
    super.onUpdate();

    if (Math.random() < 0.01) {
      const button = this.button;
      this.emit(button.x, button.y);
    }
  }

  protected onRender() {
    this.context.clear();
    super.onRender();
  }
}
