import FollowButton from "./FollowButton";

export default class SyncedFollowButton extends FollowButton {
  static loadState() {
    return localStorage.getItem("following") === "true";
  }

  static saveState(following: boolean) {
    localStorage.setItem("following", following.toString());
  }

  constructor() {
    const state = SyncedFollowButton.loadState();
    console.log("Loading state", state);
    super(state);
  }

  onClick() {
    super.onClick();
    console.log("Saving state", this.enabled);
    SyncedFollowButton.saveState(this.enabled);
  }
}
