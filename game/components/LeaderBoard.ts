import Modal from "../core/Modal";
import App from "./App";
import LeaderBoardTable from "./LeaderBoardTable";

export default class LeaderBoard extends Modal {
  constructor(readonly app: App) {
    super("Leader Board", true);
    this.classes.add("leaderboard");
    this.element.append(this.table.element);

    const onOpen = async () => {
      if (!this.populated) return onOpen();
      const customer = this.table.findCustomerRow();
      if (!customer) return;
      customer.element.scrollIntoView({
        behavior: "smooth",
      });
    };

    this.on("open", onOpen);
  }

  private populated = false;
  populate() {
    if (this.populated) return;
    this.table.populate();
  }

  readonly table = new LeaderBoardTable(this);
}
