import FollowButton from "../buttons/FollowButton";
import CoinCounter from "../components/CoinCounter";
import Clock from "./Clock";

const WATCH_REWARD = 1;
const WATCH_REWARD_INTERVAL = 5000;
const FOLLOW_REWARD = 100;
const LIKE_REWARD = 5;
const SHARE_REWARD = 200;
const CHAT_REWARD = 50;
const SIGN_UP_REWARD = 500;

export default class RewardSystem {
  readonly clock = new Clock();
  readonly counter = new CoinCounter();

  update() {
    const clock = this.clock;
    const counter = this.counter;

    clock.update();

    if (clock.elapsed > WATCH_REWARD_INTERVAL) {
      // counter.addCoins(WATCH_REWARD);
      clock.reset();
    }
  }

  private followRewarded = false;

  onFollowClick(button: FollowButton) {
    if (button.enabled && !this.followRewarded) {
      this.followRewarded = true;
      this.counter.addCoins(FOLLOW_REWARD);
    }
  }

  onLikeClick() {
    this.counter.addCoins(LIKE_REWARD);
  }

  onShareComplete() {
    this.counter.addCoins(SHARE_REWARD);
  }

  onChatMessageSent() {
    this.counter.addCoins(CHAT_REWARD);
  }

  onSignUp() {
    this.counter.addCoins(SIGN_UP_REWARD);
  }
}
