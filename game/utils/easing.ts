export function easeInQuad(x: number): number {
  return x * x;
}

export function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

export function linear(x: number): number {
  return x;
}

export function invert(x: number): number {
  return 1 - x;
}
