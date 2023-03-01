import LocalStorage from "../utils/LocalStorage";
import getRandomUsers from "./mock/getRandomUsers";
import Model from "./Model";
import User from "./User";

const INITIAL_APP_STATE = {
  loggedIn: false,
  following: false,
  knowsHowToFullscreen: false,
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

  constructor() {
    this.loadStreamer();
    this.loadRandomUsers();
  }

  private async loadStreamer() {}

  private async loadRandomUsers() {
    if (this.userModel.count > 0) return;
    const users = await getRandomUsers(50);
    this.userModel.saveAll(users);
  }

  reset() {
    this.storage.reset();
    this.userStorage.reset();
  }
}
