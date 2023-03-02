import LocalStorage from "../utils/LocalStorage";
import getRandomUsers from "./mock/getRandomUsers";
import Model from "./Model";
import User from "./User";
import { version } from "../../package.json";

const old = localStorage.getItem("stromer-version");

if (old !== version) {
  localStorage.clear();
  localStorage.setItem("stromer-version", version);
}

const INITIAL_APP_STATE = {
  loggedIn: false,
  following: false,
  knowsHowToFullscreen: false,
  knowsHowToLogin: false,
  knowsResetInfo: false,
  rewardedForFollowing: false,
};

const INITIAL_USERS_STATE = {
  customerId: "",
  streamer: null as User | null,
  users: <User[]>[],
};

export default class AppState {
  readonly storage = new LocalStorage("stromer", INITIAL_APP_STATE);
  readonly userStorage = new LocalStorage("stromer-users", INITIAL_USERS_STATE);

  readonly app = this.storage.proxy;

  readonly users = new Model(this.userStorage, "users", User);

  get customerId() {
    return this.users.data.customerId;
  }

  get coins() {
    return this.users.get(this.customerId)?.coins || 0;
  }

  set coins(coins: number) {
    this.users.patch(this.customerId, { coins });
  }

  public ready: Promise<void>;

  constructor() {
    this.load();
  }

  private load() {
    return (this.ready = Promise.all([
      this.loadStreamer(),
      this.loadRandomUsers(),
    ]) as unknown as Promise<void>);
  }

  private async loadStreamer() {
    if (this.users.data.streamer) return;
    const streamer = await getRandomUsers(1);
    this.users.data.streamer = streamer[0];
  }

  private async loadRandomUsers() {
    if (this.users.count > 0) return;
    const users = await getRandomUsers(10);
    this.users.saveAll(users);
    this.users.data.customerId = users[0].id;
  }

  async reset() {
    this.userStorage.reset();
    await this.load();
    this.coins = 0;
    this.app.following = false;
    this.app.rewardedForFollowing = false;
  }
}
