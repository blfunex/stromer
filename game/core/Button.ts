import Component from "./Component";

export default class Button extends Component<HTMLButtonElement> {
  constructor(label: string, setText = true) {
    super(document.createElement("button"));
    this.type = "button";
    this.label = label;
    if (setText) this.text = label;
  }

  get type() {
    return this.element.type;
  }

  set type(type: string) {
    this.element.type = type;
  }

  get label() {
    return this.element.getAttribute("aria-label") ?? "";
  }

  set label(label: string) {
    this.element.setAttribute("aria-label", label);
  }
}
