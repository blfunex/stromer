import Button from "../components/Button";
import RewardSystem from "../utils/RewardSystem";

export default class LikeButton extends Button {
  constructor(private rewards: RewardSystem) {
    super("Like");
    this.element.position(width - 48, height - 48).size(48, 48);
  }

  onClick() {
    this.rewards.onLikeClick();
  }
}
