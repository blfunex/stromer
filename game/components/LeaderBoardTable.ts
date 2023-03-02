import Component from "../core/Component";
import User from "../states/User";
import LeaderBoard from "./LeaderBoard";
import LeaderBoardRank from "./LeaderBoardRank";

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
  }

  readonly lines: LeaderBoardRank[];

  isScrolling = false;

  get users() {
    return this.leaderboard.app.state.users.users;
  }

  get customerId() {
    return this.leaderboard.app.state.users.customerId;
  }

  populate() {
    // @ts-ignore
    this.lines = this.users
      .sort((a, b) => b.coins - a.coins)
      .map((user, i) => {
        const rank = new LeaderBoardRank(this, i + 1, user, this.customerId);
        this.element.append(rank.element);
        return rank;
      });

    for (const line of this.lines) {
      line.update();
    }
    this.startRandomRankChanges();
  }

  changeUsers(users: User[], customerId: string) {
    if (users.length !== this.lines.length) {
      throw new Error("Cannot change users with different length");
    }

    for (let i = 0; i < users.length; i++) {
      const line = this.lines[i];
      line.user = users[i];
      line.customerId = customerId;
    }

    this.sort();
  }

  startRandomRankChanges() {
    for (const rank of this.lines) {
      rank.startRandomRankChanges();
    }
  }

  sort() {
    this.lines.sort((a, b) => b.user.coins - a.user.coins);

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      line.rank = i + 1;
    }
  }
}