export default class Clock {
  private start = performance.now();
  private current = this.start;

  update() {
    this.current = performance.now();
  }

  reset() {
    this.start = this.current;
  }

  get elapsed() {
    return this.current - this.start;
  }
}
