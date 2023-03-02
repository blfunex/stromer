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
import { easeInQuint, invert } from "../utils/easing";
import { randomInt, randomUint } from "../utils/utils";

const coinPosition = { x: 0, y: 0 };

const simulators = [
  new PositionEulerSimulator({
    position: 16,
    velocity: {
      x: 500,
      y: [-500, 100],
    },
    acceleration: { x: 0, y: [250, 1000] },
  }),
];

const graphics = new CircleGraphics(
  [
    (particle) => (particle.r = randomInt(5, 10)),
    (particle, t) => invert(easeInQuint(t)) * particle.r,
  ],
  true,
  true
);

const age = new PaletteSelectorTheme(
  [
    "gold",
    "silver",
    "DarkOrange",
    "SlateGray",
    "LightSlateGray",
    "white",
    "hotpink",
    "gold",
    "red",
  ],
  (_, isCoins) => (isCoins ? randomInt(0, 4) : 5)
);
// const age = new AgeFadingTheme(theme);

export default class InteractionParticles extends ParticleSystem<Particle> {
  constructor(loop: SimulationLoop, context: Context2D) {
    super(loop, context, {
      capacity: 1000,
      rate: 20,
      timeout: 0.1,
      simulators,
      graphics,
      theme: age,
    });
  }

  interact(coins: boolean) {
    this.emit(this.x, this.y, coins);
  }

  updateCoinPosition(x: number, y: number) {
    coinPosition.x = x;
    coinPosition.y = y;
  }
}
