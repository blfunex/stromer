import Button from "../core/Button";
import Icon from "../core/Icon";

const RESET_ICON = new Icon(
  "M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9",
  24,
  24
);

export default class ResetButton extends Button {
  constructor() {
    super("Reset", false);
    this.append(RESET_ICON);
    this.classes = "reset-button debug-button";
  }
}
