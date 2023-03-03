import { find } from "lodash";
import Component from "../core/Component";
import User from "../states/User";
import LeaderBoard from "./LeaderBoard";
import LeaderBoardRow from "./LeaderBoardRow";
import SoundMaker from "./SoundMaker";

const promotionMp3 = new URL("./assets/promotion.mp3", import.meta.url).href;
const demotionMp3 = new URL("./assets/demotion.mp3", import.meta.url).href;
const rankedMp3 = new URL("./assets/ranked.mp3", import.meta.url).href;
const derankedMp3 = new URL("./assets/deranked.mp3", import.meta.url).href;

export default class LeaderBoardTable extends Component<HTMLOListElement> {
  constructor(readonly leaderboard: LeaderBoard) {
    super(document.createElement("ol"));
    this.classes = "leader-board-table";

    let timeout: number;
    this.on("scroll", () => {
      this.isScrolling = true;
      clearTimeout(timeout);
      setTimeout(() => {
        this.isScrolling = false;
      }, 1000);
    });

    this.element.tabIndex = 0;

    this.sounds.loadSound("promotion", promotionMp3, 0.2);
    this.sounds.loadSound("demotion", demotionMp3, 0.2);
    this.sounds.loadSound("rankup", rankedMp3, 0.1);
    this.sounds.loadSound("derank", derankedMp3, 0.1);

    this.on("click", () => {
      this.element.focus();
    });
  }

  readonly sounds = new SoundMaker();

  public rows: LeaderBoardRow[];

  isScrolling = false;

  get users() {
    return this.leaderboard.state.users.list;
  }

  get customerId() {
    return this.leaderboard.state.customerId;
  }

  get customer() {
    return (
      (find(this.rows, {
        user: {
          id: this.customerId,
        },
      }) as LeaderBoardRow | undefined) ?? null
    );
  }

  populate() {
    this.rows = this.users.map((user, i) => {
      const rank = new LeaderBoardRow(this, i + 1, user, this.customerId);
      this.element.append(rank.element);
      return rank;
    });

    this.sort();
    this.startRandomRankChanges();
  }

  changeUsers(users: readonly User[], customerId: string) {
    if (users.length !== this.rows.length) {
      throw new Error("Cannot change users with different length");
    }

    for (let i = 0; i < users.length; i++) {
      const line = this.rows[i];
      line.user = users[i];
      line.customerId = customerId;
    }

    this.sort();
  }

  startRandomRankChanges() {
    for (const rank of this.rows) {
      rank.startRandomRankChanges();
    }
  }

  sort() {
    this.rows.sort((a, b) => Math.sign(b.user.coins - a.user.coins));

    for (let i = 0; i < this.rows.length; i++) {
      const line = this.rows[i];
      line.rank = i + 1;
    }

    for (const line of this.rows) {
      line.update();
    }
  }
}
