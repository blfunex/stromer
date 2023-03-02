export function pick<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffle<T>(array: T[]) {
  return array.sort(() => randomSign());
}

export function generate<T>(length: number, generator: (index: number) => T) {
  return Array.from({ length }, (_, index) => generator(index));
}

export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomAngle(limit = Math.PI) {
  return randomUniform(0, limit);
}

export function randomSign(zero = false) {
  if (zero) return randomInt(-1, 1);
  return Math.random() < 0.5 ? -1 : 1;
}

export function randomUniform(offset: number, limit: number) {
  return randomFloat(offset - limit, offset + limit);
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomFloat(min, max + 1));
}

export function randomUint(range: number, offset = 0) {
  return randomInt(offset, offset + Math.max(0, range - 1));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ordinalSuffixes = ["th", "st", "nd", "rd"];
export function ordinal(n: number) {
  const roll = n % 100;
  return (
    n +
    (ordinalSuffixes[(roll - 20) % 10] ??
      ordinalSuffixes[roll] ??
      ordinalSuffixes[0])
  );
}
