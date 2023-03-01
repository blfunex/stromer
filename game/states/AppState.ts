import LocalStorage from "../utils/LocalStorage";
import getRandomUsers from "./mock/getRandomUsers";
import Model from "./Model";
import User from "./User";

const INITIAL_APP_STATE = {
  following: false,
  rewarededForFollowing: false,
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

  get rewardedForFollowing() {
    return this.storage.get("rewarededForFollowing");
  }

  set rewardedForFollowing(state: boolean) {
    this.storage.set("rewarededForFollowing", state);
  }

  get following() {
    return this.storage.get("following");
  }

  set following(state: boolean) {
    this.storage.set("following", state);
  }

  get coins() {
    return this.storage.get("coins");
  }

  set coins(value: number) {
    this.storage.set("coins", value);
  }

  readonly users = new Model(this.userStorage, "users", User);

  constructor() {
    this.loadStreamer();
    this.loadRandomUsers();
  }

  async loadStreamer() {}

  async loadRandomUsers() {
    if (this.users.count > 0) return;
    const users = await getRandomUsers(50);
    this.users.saveAll(users);
  }

  reset() {
    this.storage.reset();
    this.userStorage.reset();
  }
}
