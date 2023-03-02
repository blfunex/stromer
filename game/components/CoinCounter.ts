import Component from "../core/Component";
import Icon from "../core/Icon";
import { wait } from "../utils/utils";
import CoinParticles from "./CoinParticles";
import InteractionParticles from "./InteractionParticles";
import SoundMaker from "./SoundMaker";

const COIN_ICON = new Icon(
  "M264.4 95.01c-35.6-.06-80.2 11.19-124.2 34.09C96.27 152 61.45 182 41.01 211.3c-20.45 29.2-25.98 56.4-15.92 75.8 10.07 19.3 35.53 30.4 71.22 30.4 35.69.1 80.29-11.2 124.19-34 44-22.9 78.8-53 99.2-82.2 20.5-29.2 25.9-56.4 15.9-75.8-10.1-19.3-35.5-30.49-71.2-30.49zm91.9 70.29c-3.5 15.3-11.1 31-21.8 46.3-22.6 32.3-59.5 63.8-105.7 87.8-46.2 24.1-93.1 36.2-132.5 36.2-18.6 0-35.84-2.8-50.37-8.7l10.59 20.4c10.08 19.4 35.47 30.5 71.18 30.5 35.7 0 80.3-11.2 124.2-34.1 44-22.8 78.8-52.9 99.2-82.2 20.4-29.2 26-56.4 15.9-75.7zm28.8 16.8c11.2 26.7 2.2 59.2-19.2 89.7-18.9 27.1-47.8 53.4-83.6 75.4 11.1 1.2 22.7 1.8 34.5 1.8 49.5 0 94.3-10.6 125.9-27.1 31.7-16.5 49.1-38.1 49.1-59.9 0-21.8-17.4-43.4-49.1-59.9-16.1-8.4-35.7-15.3-57.6-20zm106.7 124.8c-10.2 11.9-24.2 22.4-40.7 31-35 18.2-82.2 29.1-134.3 29.1-21.2 0-41.6-1.8-60.7-5.2-23.2 11.7-46.5 20.4-68.9 26.1 1.2.7 2.4 1.3 3.7 2 31.6 16.5 76.4 27.1 125.9 27.1s94.3-10.6 125.9-27.1c31.7-16.5 49.1-38.1 49.1-59.9z",
  512,
  512
);

const tickMp3 = new URL("./assets/tick.mp3", import.meta.url).href;
const coinsMp3 = new URL("./assets/coins.mp3", import.meta.url).href;
const dropMp3 = new URL("./assets/drop.mp3", import.meta.url).href;

export default class CoinCounter extends Component<HTMLDivElement> {
  private _count: number;

  private output = document.createElement("output");

  readonly sounds = new SoundMaker();

  constructor(
    count: number,
    readonly coins: CoinParticles,
    readonly interaction: InteractionParticles
  ) {
    super(document.createElement("div"));
    this.classes = "coin-counter";
    this.append(COIN_ICON);
    this._count = count;
    this.updateCount();
    this.element.appendChild(this.output);
    this.sounds.loadSound("tick", tickMp3, 0.2);
    this.sounds.loadSound("coins", coinsMp3, 0.5);
    this.sounds.loadSound("drop", dropMp3);
  }

  get count() {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
    this.emit("change", this._count);
    this.updateCount();
  }

  private updateCount() {
    this.output.textContent = this._count.toString();
  }

  private setCountAnimated(value: number) {
    this.count = value;
    this.animate();
  }

  private animate() {
    this.element.animate(
      {
        transform: [
          "scale(1)",
          "scale(2)",
          "scale(0.9)",
          "scale(1.2)",
          "scale(1)",
        ],
      },
      {
        duration: 200,
      }
    );
  }

  async tick() {
    this.sounds.play("tick");
    this.interaction.interact(true);
    await wait(500);
    this.setCountAnimated(this.count + 1);
    this.sounds.play("coins");
    this.coins.interact();
  }

  add(amount: number) {
    this.setCountAnimated(this.count + amount);
    this.sounds.play("coins");
    this.coins.interact();
    this.interaction.interact(false);
  }

  reset() {
    this.setCountAnimated(0);
    this.sounds.play("drop");
  }
}
