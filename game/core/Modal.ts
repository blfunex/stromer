import Component from "./Component";

export default class Modal extends Component<HTMLDialogElement> {
  constructor(title: string, closable: boolean) {
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

  open() {
    this.element.showModal();
    const onClickOutside = (event: MouseEvent) => {
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
    this.once("click", onClickOutside);
    return new Promise<string>((resolve) => {
      this.once("close", () => {
        this.off("click", onClickOutside);
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
