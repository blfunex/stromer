import RewardSystem from "../utils/RewardSystem";
import SyncedFollowButton from "./SyncedFollowButton";

export default class RewardedFollowButton extends SyncedFollowButton {
  constructor(readonly rewards: RewardSystem) {
    super();
  }

  onClick() {
    super.onClick();
    this.rewards.onFollowClick(this);
  }
}
