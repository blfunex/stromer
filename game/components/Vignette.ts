import Component from "../core/Component";

export default class Vignette extends Component<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"));
    this.classes = "vignette";
  }
}
