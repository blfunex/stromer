import { RandomUser } from "./mock/getRandomUsers";
import { ModelInstance } from "./Model";

export default class User implements ModelInstance {
  constructor(readonly id: string) {}

  username = "";
  firstName = "";
  lastName = "";
  password = "";
  avatar?: string = undefined;

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
    return this;
  }
}
