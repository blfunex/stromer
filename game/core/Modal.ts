import Component from "./Component";

export default class Modal extends Component<HTMLDialogElement> {
  constructor() {
    super(document.createElement("dialog"));
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
}
