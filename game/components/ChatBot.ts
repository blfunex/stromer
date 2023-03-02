import { randomInt, wait } from "../utils/utils";
import { faker } from "@faker-js/faker";

export default class ChatBot {
  constructor(readonly onMessage: (message: string) => void) {
    this.ponder();
  }

  async ponder() {
    await wait(randomInt(1000, 5000));
    this.onMessage(faker.lorem.sentence());
  }
}
