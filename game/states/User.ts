import { JsonObject } from "../utils/LocalStorage";
import { randomInt } from "../utils/utils";
import { RandomUser } from "./mock/getRandomUsers";
import { ModelInstance } from "./Model";

export default class User implements ModelInstance {
  constructor(readonly id: string) {}

  username = "";
  firstName = "";
  lastName = "";
  password = "";
  avatar = "";
  coins = randomInt(0, 500);

  static fromRandomUser(data: RandomUser.UserResult): User {
    const user = new User(data.login.uuid);
    user.username = data.login.username;
    user.firstName = data.name.first;
    user.lastName = data.name.last;
    user.password = data.login.password;
    user.avatar = data.picture.thumbnail;
    return user;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      avatar: this.avatar,
      coins: this.coins,
    };
  }

  fromJSON(data: {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    avatar: string;
    coins: number;
  }) {
    this.username = data.username;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.password = data.password;
    this.avatar = data.avatar;
    this.coins = data.coins;
  }
}
