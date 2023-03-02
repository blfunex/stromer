import Context2D from "../interactive/Context2D";
import ParticleSystem, {
  AgeFadingTheme,
  CircleGraphics,
  ConstantTheme,
  LerpTowardsPointSimulator,
  PaletteSelectorTheme,
  Particle,
  PositionEulerSimulator,
} from "../interactive/particles/ParticleSystem";
import SimulationLoop from "../interactive/SimulationLoop";
import { easeInQuint } from "../utils/easing";
import { randomInt, randomUint } from "../utils/utils";

const coinPosition = { x: 0, y: 0 };

const simulators = [
  new PositionEulerSimulator({
    position: 0,
    velocity: 10,
    acceleration: 700,
  }),
];

const graphics = new CircleGraphics(
  [
    (particle) => (particle.r = randomUint(5, 1)),
    (particle, t) => (1 - easeInQuint(t)) * particle.r,
  ],
  true,
  true
);

const theme = new PaletteSelectorTheme(
  ["gold", "white", "hotpink", "gold", "red"],
  (palette, isCoins, random) =>
    isCoins ? 0 : 1 + Math.max(0, random(palette) - 1)
);
const age = new AgeFadingTheme(theme);

export default class InteractionParticles extends ParticleSystem<Particle> {
  constructor(loop: SimulationLoop, context: Context2D) {
    super(loop, context, {
      capacity: 1000,
      rate: 20,
      timeout: 0.5,
      simulators,
      graphics,
      theme: age,
    });
  }

  private x = 0;
  private y = 0;

  attachMouseTracker() {
    this.context.ctx.canvas.parentNode!.addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        this.x = e.offsetX;
        this.y = e.offsetY;

        if (e.target !== e.currentTarget) {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const currentRect = (
            e.currentTarget as HTMLElement
          ).getBoundingClientRect();

          this.x += rect.left - currentRect.left;
          this.y += rect.top - currentRect.top;
        }

        // this.interact();
      }
    );
  }

  interact(coins: boolean) {
    this.emit(this.x, this.y, coins);
  }

  updateCoinPosition(x: number, y: number) {
    coinPosition.x = x;
    coinPosition.y = y;
  }
}
