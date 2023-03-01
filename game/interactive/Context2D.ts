export default class Context2D {
  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }

  get width() {
    return this.ctx.canvas.width;
  }

  get height() {
    return this.ctx.canvas.height;
  }

  readonly ctx: CanvasRenderingContext2D;

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawPath2D(
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    fill: boolean,
    stroke: boolean,
    viewport: boolean,
    transform: TransformTuple,
    vx: number,
    vy: number,
    vw: number,
    vh: number,
    x = 0,
    y = 0,
    w = vw,
    h = vh,
    clip: boolean | "rect" = viewport ? "rect" : false
  ) {
    const [tx, ty, r, sx, sy] = TransformTuple.toFull(transform);

    ctx.save();

    ctx.save();

    ctx.translate(x - w / 2, y - h / 2);
    ctx.rotate(r);
    ctx.translate(tx, ty);
    ctx.scale((w / vw) * sx, (h / vh) * sy);

    if (clip === "rect") {
      ctx.beginPath();
      ctx.translate(-vx, -vy);
      ctx.rect(0, 0, vw, vh);
      ctx.clip();
    }

    if (fill) ctx.fill(path);
    if (stroke) ctx.stroke(path);
    if (clip === true) ctx.clip(path);

    ctx.restore();
  }
}

export type CanvasStyle = string | CanvasGradient | CanvasPattern;

export type FullTransformTuple = readonly [
  x: number,
  y: number,
  rotation: number,
  scaleX: number,
  scaleY: number
];

export type MarginsOptions =
  | null
  | number
  | [number, number?, number?, number?];

export type Margins = [number, number, number, number];

export function toMargins(margins: MarginsOptions): Margins {
  if (margins === null) return [0, 0, 0, 0];
  if (typeof margins === "number") return [margins, margins, margins, margins];
  const [top, right = top, bottom = top, left = right] = margins;
  return [top, right, bottom, left];
}

export type TransformTuple =
  | readonly []
  | readonly [rotation: number]
  | readonly [x: number, y: number]
  | readonly [x: number, y: number, rotation: number]
  | readonly [x: number, y: number, rotation: number, scale: number]
  | FullTransformTuple;

export namespace TransformTuple {
  export function getRotation(transform: TransformTuple) {
    switch (transform.length) {
      case 0:
      case 2:
        return 0;
      case 1:
        return transform[0];
      case 3:
      case 4:
      case 5:
        return transform[2];
      default:
        throw new Error("Invalid transform tuple");
    }
  }

  export function getScaleX(transform: TransformTuple) {
    switch (transform.length) {
      case 0:
      case 1:
      case 2:
      case 3:
        return 1;
      case 4:
      case 5:
        return transform[3];
      default:
        throw new Error("Invalid transform tuple");
    }
  }

  export function getScaleY(transform: TransformTuple) {
    switch (transform.length) {
      case 0:
      case 1:
      case 2:
      case 3:
        return 1;
      case 4:
        return transform[3];
      case 5:
        return transform[4];
      default:
        throw new Error("Invalid transform tuple");
    }
  }

  export function getTranslateX(transform: TransformTuple) {
    switch (transform.length) {
      case 0:
        return 0;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return transform[0];
      default:
        throw new Error("Invalid transform tuple");
    }
  }

  export function getTranslateY(transform: TransformTuple) {
    switch (transform.length) {
      case 0:
      case 1:
        return 0;
      case 2:
      case 3:
      case 4:
      case 5:
        return transform[1];
      default:
        throw new Error("Invalid transform tuple");
    }
  }

  export function toFull(tuple: TransformTuple): FullTransformTuple {
    switch (tuple.length) {
      case 0:
        return [0, 0, 0, 1, 1];
      case 1:
        return [0, 0, tuple[0], 1, 1];
      case 2:
        return [tuple[0], tuple[1], 0, 1, 1];
      case 3:
        return [tuple[0], tuple[1], tuple[2], 1, 1];
      case 4:
        return [tuple[0], tuple[1], tuple[2], tuple[3], tuple[3]];
      case 5:
        return tuple;
      default:
        throw new Error("Invalid transform tuple");
    }
  }
}
