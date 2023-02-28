import Button from "../components/Button";

export default class FollowButton extends Button {
  constructor(private following: boolean) {
    super("");
    this.updateText();
    this.element.position(200, 20).size(80, 24);
  }

  private updateText() {
    this.element.html(this.following ? "Following" : "Follow");
  }

  get enabled() {
    return this.following;
  }

  onClick() {
    this.following = !this.following;
    this.updateText();
  }
}
