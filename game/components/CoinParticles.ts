import Context2D from "../interactive/Context2D";
import ParticleSystem, {
  AgeFadingTheme,
  CircleGraphics,
  ConstantTheme,
  LerpTowardsPointSimulator,
  Particle,
  PositionEulerSimulator,
} from "../interactive/particles/ParticleSystem";
import SimulationLoop from "../interactive/SimulationLoop";
import { easeInQuad, easeInQuint, linear } from "../utils/easing";
import { randomUint } from "../utils/fns";

const coinPosition = { x: 0, y: 0 };

const simulators = [
  new PositionEulerSimulator({
    position: 32,
    velocity: 100,
    acceleration: 0,
  }),
  new LerpTowardsPointSimulator(coinPosition, 0.2, linear, easeInQuad),
];

const graphics = new CircleGraphics([
  (particle) => (particle.r = randomUint(32, 1)),
  (particle, t) => (1 - easeInQuint(t)) * particle.r,
]);

const theme = new ConstantTheme("gold", null);
const age = new AgeFadingTheme(theme);

export default class CoinParticles extends ParticleSystem<Particle> {
  constructor(loop: SimulationLoop, context: Context2D) {
    super(loop, context, {
      capacity: 1000,
      rate: 5,
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

  interact() {
    this.emit(this.x, this.y);
  }

  updateCoinPosition(x: number, y: number) {
    coinPosition.x = x;
    coinPosition.y = y;
  }
}
