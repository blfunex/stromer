import Component from "./Component";

export default class Modal extends Component<HTMLDialogElement> {
  constructor(
    title: string,
    closable: boolean,
    private outsideClickCloses = false
  ) {
    super(document.createElement("dialog"));
    this.classes = "modal";
    this.element.appendChild(this.headerEl);
    this.headerEl.appendChild(this.titleEl);
    this.titleEl.textContent = title;
    this.headerEl.appendChild(this.closeBtn);
    this.closeBtn.textContent = "×";
    this.closeBtn.type = "button";
    this.closeBtn.onclick = () => this.close();
    this.closeBtn.hidden = !closable;
  }

  private titleEl = document.createElement("span");
  private headerEl = document.createElement("h1");
  private closeBtn = document.createElement("button");

  get title() {
    return this.titleEl.textContent ?? "";
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  private onClickOutside = (event: MouseEvent) => {
    var rect = this.rect;
    var isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      this.close();
    }
  };

  open(modal = true) {
    if (this.isOpen) return;
    if (document.fullscreenElement) document.exitFullscreen();
    this.classes.toggle("is-modal", modal);
    this.element[modal ? "showModal" : "show"]();
    if (this.outsideClickCloses) this.once("click", this.onClickOutside);
    return new Promise<string>((resolve) => {
      this.once("close", () => {
        this.off("click", this.onClickOutside);
        resolve(this.element.returnValue);
      });
    });
  }

  close() {
    this.element.close();
  }

  get isOpen() {
    return this.element.open;
  }
}
