import Component from "./Component";

export default class CoinCounter extends Component {
  constructor() {
    super(createDiv());
    const w = 70;
    this.element.position(width - w, 0).size(48, 48);
    this.setCoins(0);
  }

  coins = 0;

  setCoins(coins: number) {
    this.coins = coins;
    this.updateCoins();
  }

  updateCoins() {
    this.element.html(this.coins.toString());
  }

  addCoins(coins: number) {
    this.setCoins(this.coins + coins);
  }
}
