import Canvas2D from "../core/Canvas2D";
import LikeButton, { HEART_FILL_ICON, HEART_OUTLINE_ICON } from "./LikeButton";
import SimulationLoop from "../interactive/SimulationLoop";
import ParticleSystem, {
  AgeFadingTheme,
  PaletteSelectorTheme,
  Particle,
  PathParticleGraphics,
  PositionEulerSimulator,
} from "../interactive/particles/ParticleSystem";
import Context2D from "../interactive/Context2D";
import InteractionParticles from "./InteractionParticles";

const path = new Path2D(HEART_FILL_ICON.path);
const viewbox = HEART_FILL_ICON.viewbox;

interface HeartParticle extends Particle {
  userClicked: 1 | 0;
}

const simulators = [
  new PositionEulerSimulator({
    position: 0,
    velocity: {
      x: [-100, -10],
      y: [-100, -200],
    },
    acceleration: { x: [0, 50], y: 0 },
    angularVelocity: Math.PI,
  }),
];

const graphics = new PathParticleGraphics(path, viewbox, { scale: 1 });

const crimson = new PaletteSelectorTheme(
  [
    "gold",
    "crimson",
    "red",
    "pink",
    "lightpink",
    "hotpink",
    "deeppink",
    "mediumvioletred",
    "darkorchid",
    "darkmagenta",
    "purple",
    "indigo",
    "maroon",
    "tomato",
    "orangered",
    "indianred",
    "palevioletred",
    "violet",
    "brown",
    "darkred",
  ],
  (palette, userClicked, random) =>
    userClicked ? 0 : 1 + Math.max(0, random(palette) - 1)
);

function easeInCirc(x: number): number {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

const age = new AgeFadingTheme(
  crimson,
  easeInCirc,
  (particle, userClicked) => {
    particle.userClicked = userClicked ? 1 : 0;
  }
  // (particle) => particle.userClicked !== 1
);

export default class HeartSystem extends ParticleSystem<HeartParticle> {
  readonly button = new LikeButton();
  readonly canvas: Canvas2D;

  public enableClick = true;

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

    this.context.ctx.resetTransform();
    this.context.ctx.scale(dpi, dpi);

    this.loop.start();

    this.canvas.emit("resize", [rect.left, rect.top, width, height]);
  }

  private onClick() {
    if (!this.enableClick) return;
    const button = this.button;
    this.emit(button.x, button.y, true, 10);
  }

  protected onUpdate() {
    super.onUpdate();

    if (Math.random() < 0.04) {
      const button = this.button;
      this.emit(button.x, button.y, false);
    }
  }

  protected onRender() {
    this.context.clear();
    super.onRender();
  }
}
