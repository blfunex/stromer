import Button from "./Button";

export default class ToggleButton extends Button {
  private value = false;

  constructor(
    private offLabel: string,
    private onLabel: string = offLabel,
    private setText = true
  ) {
    super(offLabel, setText);
    this.element.setAttribute("aria-pressed", "false");
    this.on("click", this.onClick.bind(this));
  }

  public enableClick = true;

  get checked() {
    return this.value;
  }

  set checked(state: boolean) {
    const old = this.value;
    this.value = state;
    this.element.setAttribute("aria-pressed", state ? "true" : "false");
    this.label = state ? this.onLabel : this.offLabel;
    if (this.setText) this.text = this.label;
    if (this.value === old) return;
    this.emit("change", state);
  }

  protected onClick() {
    if (!this.enableClick) return;
    this.checked = !this.checked;
  }
}
