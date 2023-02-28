import Component from "./Component";

export default class Drawer extends Component {
  constructor(header: string) {
    super(createElement("dialog"));
    this.headerElt.html(header);
    this.headerElt.child(this.closeBtn);
    this.element.child(this.headerElt).addClass("drawer");
    this.closeBtn.mouseClicked(() => this.close());
    this.open();
  }

  private headerElt = createElement("h1");
  private closeBtn = createElement("button", "×");

  open() {
    this.element.elt.showModal();
  }

  close() {
    this.element.elt.close();
  }
}
