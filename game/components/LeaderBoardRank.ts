import Component from "../core/Component";
import Icon from "../core/Icon";
import User from "../states/User";
import { ordinal, randomInt, wait } from "../utils/utils";
import { CoinIcon } from "./CoinCounter";
import LeaderBoardTable from "./LeaderBoardTable";

const StarIcon = new Icon(
  "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z",
  1024,
  1024
);

export default class LeaderBoardRank extends Component<HTMLLIElement> {
  constructor(
    readonly table: LeaderBoardTable,
    rank: number,
    public user: User,
    public customerId: string
  ) {
    super(document.createElement("li"));
    this.markup();
    this._rank = rank;
  }

  private _rank: number;

  get rank() {
    return this._rank;
  }

  set rank(rank: number) {
    this._rank = rank;
    this.updateRank();
  }

  private rankNumber = document.createElement("span");
  private profileImage = document.createElement("img");
  private name = document.createElement("div");
  private firstName = document.createElement("span");
  private lastName = document.createElement("span");
  private username = document.createElement("span");
  private coins = document.createElement("div");
  private coinCount = document.createElement("span");

  readonly star = StarIcon.clone();

  private markup() {
    this.classes = "leader-board-rank";
    const fullname = document.createElement("div");
    fullname.className = "fullname";
    fullname.append(this.firstName, this.lastName);
    this.star.classes = "star";
    this.star.isHidden = true;
    this.username.className = "username";
    this.name.className = "name";
    this.name.append(this.star.element, fullname, this.username);
    this.coins.className = "coins";
    this.coins.append(this.coinCount, CoinIcon.clone().element);
    this.element.append(
      this.rankNumber,
      this.coins,
      this.profileImage,
      this.name
    );
  }

  public update() {
    this.rankNumber.textContent = `${ordinal(this.rank)}.`;
    this.profileImage.src = this.user.avatar;
    this.firstName.textContent = this.user.firstName;
    this.lastName.textContent = this.user.lastName;
    this.username.textContent = `@${this.user.username}`;
    this.coinCount.textContent = `${this.user.coins}`;

    const isCustomer = this.user.id === this.customerId;

    this.star.isHidden = !isCustomer;

    this.updateRank();
  }

  private _lastRank = 0;
  private updateRank() {
    this.rankNumber.textContent = `${this.rank}.`;
    this.style.order = `${this.rank}`;

    const isTop = this.rank === 1;
    const isTopTen = this.rank <= 10;
    const isBottomTen = this.rank >= this.table.lines.length - 10;
    const isBottom = this.rank === this.table.lines.length;

    const isCustomer = this.user.id === this.customerId;
    const isOpen = this.table.leaderboard.isOpen;
    const isScrolling = this.table.isScrolling;

    this.classes.toggle("customer", isCustomer);
    this.classes.toggle("top", isTop);
    this.classes.toggle("top-ten", isTopTen);
    this.classes.toggle("bottom-ten", isBottomTen);
    this.classes.toggle("bottom", isBottom);

    const isRankChanged = this._lastRank !== this.rank;

    this._lastRank = this.rank;

    if (!isRankChanged) return;

    const isMilestone = isTop || isTopTen || isBottomTen || isBottom;

    if (isMilestone && isCustomer && !isScrolling) {
      if (!isOpen) this.table.leaderboard.open();
      this.element.scrollIntoView({ behavior: "smooth" });
    }
  }

  startRandomRankChanges() {
    this.interact();
  }

  private async interact() {
    const delay = randomInt(1000, 30000); // 1s - 30s

    await wait(delay);

    const isCustomer = this.user.id === this.customerId;

    if (isCustomer) return;

    // To simulate competition
    const isTop = this.rank === 1;
    const isTop3 = this.rank <= 3;
    const isTop10 = this.rank <= 10;
    const isTop25 = this.rank <= 30;
    const isBottom25 = this.rank >= this.table.lines.length - 30;

    const effortMax = isTop
      ? 0
      : isTop3
      ? 300
      : isTop10
      ? 1
      : isTop25
      ? 100
      : isBottom25
      ? 200
      : 300;
    const effort = randomInt(0, effortMax);

    this.user.coins += effort;
    this.table.leaderboard.app.state.users.save(this.user);
    this.updateRank();

    if (effort > 0) {
      this.table.sort();
    }
  }
}
