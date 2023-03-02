import { find } from "lodash";
import LocalStorage, { JsonObject } from "../utils/LocalStorage";

export default class Model<
  S extends { [key in K]: T[] },
  K extends string,
  T extends ModelInstance
> {
  constructor(
    readonly storage: LocalStorage<S>,
    readonly id: K,
    readonly type: ModelConstructor<T>
  ) {
    this.data = storage.proxy;
  }

  readonly data: S;

  [Symbol.iterator]() {
    return this.list[Symbol.iterator]();
  }

  private _list: T[] = [];

  get list(): readonly T[] {
    if (this._list.length === 0) {
      this._list = this.storage.get(this.id) ?? [];
    }
    return this._list;
  }

  get count() {
    return this.list.length;
  }

  get(id: string): T | null {
    const user = find(this.list, { id }) ?? null;
    return user as T | null;
  }

  patch(id: string, data: Partial<T>) {
    const user = this.get(id);
    if (user) {
      this.save(Object.assign(user, data));
    }
    return null;
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

  clearAll() {
    this._list.length = 0;
    this.storage.set(this.id, (<T[]>[]) as S[K]);
  }
}

export interface ModelInstance {
  readonly id: string;
  toJSON(): JsonObject & { id: string };
  fromJSON(data: JsonObject): void;
}

export interface ModelConstructor<T extends ModelInstance> {
  new (id: string): T;
}
