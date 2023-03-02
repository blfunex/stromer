import LocalStorage from "../utils/LocalStorage";
import getRandomUsers from "./mock/getRandomUsers";
import Model from "./Model";
import User from "./User";

const INITIAL_APP_STATE = {
  loggedIn: false,
  following: false,
  knowsHowToFullscreen: false,
  knowsHowToLogin: false,
  rewardedForFollowing: false,
  coins: 0,
};

const INITIAL_USERS_STATE = {
  streamer: null as User | null,
  users: <User[]>[],
};

export default class AppState {
  readonly storage = new LocalStorage("gamified", INITIAL_APP_STATE);
  readonly userStorage = new LocalStorage(
    "gamified-users",
    INITIAL_USERS_STATE
  );

  readonly app = this.storage.proxy;
  readonly users = this.userStorage.proxy;

  readonly userModel = new Model(this.userStorage, "users", User);

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
    if (this.users.streamer) return;
    const streamer = await getRandomUsers(1);
    this.users.streamer = streamer[0];
  }

  private async loadRandomUsers() {
    if (this.userModel.count > 0) return;
    const users = await getRandomUsers(50);
    this.userModel.saveAll(users);
  }

  reset() {
    this.storage.reset();
    this.userStorage.reset();
    return this.load();
  }
}
