import { find, uniqBy } from "lodash";
import LocalStorage, { JsonObject } from "../utils/LocalStorage";

export default class Model<
  K extends string,
  S extends { [key in K]: T[] },
  T extends ModelInstance
> {
  constructor(
    readonly storage: LocalStorage<S>,
    readonly id: K,
    readonly type: ModelConstructor<T>
  ) {}

  [Symbol.iterator]() {
    return this.list[Symbol.iterator]();
  }

  private get list(): T[] {
    return this.storage.get(this.id);
  }

  get count() {
    return this.list.length;
  }

  save(data: T) {
    const list = this.list;
    const model = find(list, { id: data.id }) as T | undefined;
    if (model) {
      Object.assign(model, data);
      this.storage.set(this.id, list as S[K]);
    } else {
      this.storage.set(this.id, list.concat(data) as S[K]);
    }
  }

  saveAll(data: T[]) {
    for (const item of data) {
      this.save(item);
    }
  }
}

export interface ModelInstance {
  readonly id: string;
  toJSON(): JsonObject & { id: string };
}

export interface ModelConstructor<T extends ModelInstance> {
  new (id: string): T;
}
