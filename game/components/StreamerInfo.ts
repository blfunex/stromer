import Component from "../core/Component";
import Icon from "../core/Icon";
import ToggleButton from "../core/ToggleButton";
import User from "../states/User";

const FollowerIcon = new Icon(
  "M256 256a112 112 0 10-112-112 112 112 0 00112 112zm0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z",
  512,
  512
);

export default class StreamerInfo extends Component<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"));
    this.markup();
  }

  private _streamer: User | null = null;

  get streamer() {
    if (!this._streamer) throw new Error("Streamer not set");
    return this._streamer;
  }

  set streamer(streamer: User) {
    this._streamer = streamer;
    this.update();
    this.followButton.on("change", () => {
      this.update();
    });
  }

  private profileImage = document.createElement("img");
  private name = document.createElement("div");
  private firstName = document.createElement("span");
  private lastName = document.createElement("span");
  private followers = document.createElement("div");
  private followersCount = document.createElement("span");
  readonly followButton = new ToggleButton("Follow", "Following");

  get followCount() {
    return this.streamer.coins;
  }

  private markup() {
    this.classes = "streamer-info";
    this.name.append(this.firstName, this.lastName);
    this.followers.append(this.followersCount, FollowerIcon.element);
    this.element.append(
      this.profileImage,
      this.name,
      this.followers,
      this.followButton.element
    );
  }

  private update() {
    if (!this._streamer) return;
    this.profileImage.src = this._streamer.avatar;
    this.firstName.textContent = this._streamer.firstName;
    this.lastName.textContent = this._streamer.lastName;
    this.followersCount.textContent = `${
      this.followCount + (this.followButton.checked ? 1 : 0)
    }`;
  }
}
