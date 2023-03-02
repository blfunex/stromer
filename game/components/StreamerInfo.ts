import Component from "../core/Component";
import ToggleButton from "../core/ToggleButton";
import User from "../states/User";
import { randomUint } from "../utils/utils";

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
  private followCount = randomUint(500, 100);

  private markup() {
    this.classes = "streamer-info";
    this.name.append(this.firstName, this.lastName);
    this.followers.append(this.followersCount, " followers");
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
