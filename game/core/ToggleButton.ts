import Button from "./Button";

export default class ToggleButton extends Button {
  private value = false;

  constructor(
    private offLabel: string,
    private onLabel: string,
    private setText = true
  ) {
    super(offLabel, setText);
    this.element.setAttribute("aria-pressed", "false");
    this.on("click", this.onClick.bind(this));
  }

  get checked() {
    return this.value;
  }

  set checked(state: boolean) {
    this.value = state;
    this.element.setAttribute("aria-pressed", state ? "true" : "false");
    this.label = state ? this.onLabel : this.offLabel;
    if (this.setText) this.text = this.label;
    this.emit("change", state);
  }

  protected onClick() {
    this.checked = !this.checked;
  }
}
