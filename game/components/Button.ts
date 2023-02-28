import Component from "./Component";

export default class Button extends Component {
  constructor(text: string) {
    super(createButton(text));
    this.element.mouseClicked(this.onClick.bind(this));
    this.element.position(0, 0);
  }

  onClick() {}
}
