import Component from "../core/Component";

export default class CoinCounter extends Component<HTMLDivElement> {
  private _count: number;

  constructor() {
    super(document.createElement("div"));
    this.classes = "coin-counter";
    this.count = 0;
  }

  get count() {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
    this.text = `Score: ${this._count} coin${this._count === 1 ? "" : "s"}`;
  }
}
