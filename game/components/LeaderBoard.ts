import Component from "../core/Component";
import Modal from "../core/Modal";
import App from "./App";
import LeaderBoardTable from "./LeaderBoardTable";

export default class LeaderBoard extends Modal {
  constructor(readonly app: App) {
    super("Leader Board", true);
    this.classes.add("leaderboard");
    this.element.append(this.table.element);
  }

  populate() {
    this.table.populate();
  }

  readonly table = new LeaderBoardTable(this);
}
