import Modal from "../core/Modal";
import AppState from "../states/AppState";
import App from "./App";
import LeaderBoardTable from "./LeaderBoardTable";

export default class LeaderBoard extends Modal {
  constructor(readonly app: App) {
    super("Leader Board", true, true);
    this.state = app.state;
    this.classes.add("leaderboard");
    this.element.append(this.table.element);

    const onOpen = async () => {
      if (!this.populated) return onOpen();
      this.table.element.focus();
      this.table.customer?.element.scrollIntoView({
        behavior: "smooth",
      });
    };

    this.on("open", onOpen);
  }

  readonly state: AppState;

  private populated = false;
  populate() {
    if (this.populated) return;
    this.table.populate();
  }

  readonly table = new LeaderBoardTable(this);
}
