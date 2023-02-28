import Canvas from "./Canvas";

export default class Canvas2D extends Canvas<"2d"> {
  constructor(options?: CanvasRenderingContext2DSettings) {
    super("2d", options);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawPath2D(
    path: Path2D,
    viewbox: ViewBoxTuple,
    fill: boolean,
    stroke: boolean,
    x: number,
    y: number,
    r = 0,
    w?: number,
    h?: number
  ) {
    const [vx, vy, vw, vh] = viewbox;

    w ??= vw;
    h ??= vh;

    const ctx = this.context;

    ctx.save();

    ctx.translate(x, y);

    if (r) ctx.rotate(r);

    if (w !== vw || h !== vh) {
      ctx.scale(w / vw, h / vh);
    }

    ctx.beginPath();
    ctx.translate(-vx, -vy);
    ctx.rect(0, 0, vw, vh);
    ctx.clip();

    if (fill) ctx.fill(path);
    if (stroke) ctx.stroke(path);

    ctx.restore();
  }

  fillPath2D(
    path: Path2D,
    viewbox: ViewBoxTuple,
    x: number,
    y: number,
    r = 0,
    w?: number,
    h?: number
  ) {
    this.drawPath2D(path, viewbox, true, false, x, y, r, w, h);
  }

  strokePath2D(
    path: Path2D,
    viewbox: ViewBoxTuple,
    x: number,
    y: number,
    r = 0,
    w?: number,
    h?: number
  ) {
    this.drawPath2D(path, viewbox, false, true, x, y, r, w, h);
  }
}

type ViewBoxTuple = readonly [
  x: number,
  y: number,
  width: number,
  height: number
];
