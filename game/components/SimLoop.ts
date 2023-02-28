type Ticker = (step: number, simTime: number) => void;
type Renderer = (blending: number, appTime: number, frameDelta: number) => void;
type Updater = (appTime: number, frameDelta: number, simTime: number) => void;

export default class GameLoop {
  readonly rate: number;
  readonly interval: number;
  readonly step: number;

  private _tickers: Ticker[] = [];
  private _renderer: Renderer[] = [];
  private _updaters: Updater[] = [];

  constructor(rate: number) {
    this.rate = rate;
    this.interval = 1000 / rate;
    this.step = 1 / rate;
  }

  onTick(ticker: Ticker) {
    this._tickers.push(ticker);
  }

  onRender(renderer: Renderer) {
    this._renderer.push(renderer);
  }

  onUpdate(updater: Updater) {
    this._updaters.push(updater);
  }

  private _running = false;

  start() {
    if (this._running) return;
    this._last = performance.now();
    this._running = true;
    this._requestFrame();
    window.addEventListener("pagehide", this._onPageHide);
    window.addEventListener("pageshow", this._onPageShow);
  }

  stop() {
    if (!this._running) return;
    this._running = false;
    this._cancelFrame();
    window.removeEventListener("pagehide", this._onPageHide);
    window.removeEventListener("pageshow", this._onPageShow);
  }

  private _last = 0;

  private _frame = (now: number) => {
    if (!this._running) return;

    const dt = now - this._last;

    this._update(now, dt);

    this._last = now;
    this._lag += dt;

    while (this._lag >= this.interval) {
      this._tick(this.step);
    }

    this._render(this._lag / this.interval, now, dt);

    this._requestFrame();
  };

  private _update(appTime: number, frameDelta: number) {
    for (const updater of this._updaters) {
      updater(appTime, frameDelta, this._time);
    }
  }

  private _lag = 0;
  private _time = 0;

  private _tick(step: number) {
    this._lag -= this.interval;
    this._time += this.step;
    for (const ticker of this._tickers) {
      ticker(step, this._time);
    }
  }

  private _render(blendingDelta: number, appTime: number, frameDelta: number) {
    for (const renderer of this._renderer) {
      renderer(blendingDelta, appTime, frameDelta);
    }
  }

  private _onPageHide = () => this._onPageHiddenChange(false);
  private _onPageShow = () => this._onPageHiddenChange(true);

  private _onPageHiddenChange(visible: boolean) {
    if (!this._running) return;
    if (visible) {
      this._last = performance.now();
      this._requestFrame();
    } else {
      this._cancelFrame();
    }
  }

  private _fid = 0;
  private _requestFrame() {
    this._fid = requestAnimationFrame(this._frame);
  }
  private _cancelFrame() {
    cancelAnimationFrame(this._fid);
  }
}
