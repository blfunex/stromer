export default class LocalStorage<T extends JsonObject> {
  private data: T;

  reset() {
    this.data = Object.assign({}, this.initial);
    this.save();
    this.load(this.initial);
  }

  constructor(readonly name: string, private initial: T) {
    this.load(initial);
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this.data[key] = value;
    this.save();
  }

  private save() {
    localStorage.setItem(this.name, JSON.stringify(this.data));
  }

  private load(initial: T) {
    const saved = localStorage.getItem(this.name);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (typeof data === "object" && data !== null) {
          this.data = Object.assign({}, initial, data);
        }
      } catch {}
    } else {
      this.data = Object.assign({}, initial);
      this.save();
    }
  }
}

export interface JsonObject {}

export interface JsonSerializable {
  toJSON(): JsonValue;
}

export type JsonArray = JsonValue[];

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | Date
  | JsonArray
  | JsonSerializable
  | JsonObject;

declare global {
  /**
   * @deprecated Use `LocalStorage` instead.
   */
  var localStorage: Storage;

  interface Window {
    /**
     * @deprecated Use `SessionStorage` instead.
     */
    localStorage: Storage;
  }
}
