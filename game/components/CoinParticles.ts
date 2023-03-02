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
import { easeInQuad, easeInQuint, linear } from "../utils/easing";
import { randomInt, randomUint } from "../utils/utils";

const coinPosition = { x: 0, y: 0 };

const simulators = [
  new PositionEulerSimulator({
    position: 30,
    velocity: 30,
    acceleration: 0,
  }),
  new LerpTowardsPointSimulator(coinPosition, linear, easeInQuad),
];

const graphics = new CircleGraphics(
  [
    (particle) => (particle.r = randomInt(10, 20)),
    (particle, t) => (1 - easeInQuint(t)) * particle.r,
  ],
  true
);

const theme = new PaletteSelectorTheme([
  "gold",
  "silver",
  "DarkOrange",
  "SlateGray",
  "LightSlateGray",
]);
const age = new AgeFadingTheme(theme);

export default class CoinParticles extends ParticleSystem<Particle> {
  constructor(loop: SimulationLoop, context: Context2D) {
    super(loop, context, {
      capacity: 1000,
      rate: 5,
      speed: 0.25,
      timeout: 0.5,
      simulators,
      graphics,
      theme: age,
    });
  }

  interact() {
    this.emit(this.x, this.y);
  }

  updateCoinPosition(x: number, y: number) {
    coinPosition.x = x;
    coinPosition.y = y;
  }
}
