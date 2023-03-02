import Component from "../core/Component";

export default class Chat extends Component<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"));
  }
}
