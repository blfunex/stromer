export function pick<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomAngle(limit = Math.PI) {
  return randomUniform(0, limit);
}

export function randomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function randomUniform(offset: number, limit: number) {
  return randomFloat(offset - limit, offset + limit);
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomFloat(min, max));
}

export function randomUint(range: number, offset = 0) {
  return randomInt(offset, offset + range);
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
