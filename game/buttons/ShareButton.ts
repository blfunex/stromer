import Button from "../components/Button";
import ShareDrawer from "../drawers/ShareDrawer";

export default class ShareButton extends Button {
  constructor(private drawer: ShareDrawer) {
    super("Share");
    this.element.position(width - 48 * 3, height - 48).size(48, 48);
  }

  onClick() {
    this.drawer.open();
  }
}
