import Vector from "./Vector";

export default class Icon extends Vector {
  constructor(
    path: string,
    srcWidth: number,
    srcHeight: number,
    dstWidth: number | string = "1em",
    dstHeight: number | string = "1em",
    private attribute: "stroke" | "fill" = "fill"
  ) {
    super(`<svg viewBox="0 0 ${srcWidth} ${srcHeight}" width="${dstWidth}" height="${dstHeight}" xmlns="http://www.w3.org/2000/svg">
      <path d="${path}" ${attribute}="currentColor"></path>
    </svg>`);
    this._path = this.element.querySelector("path")!;
  }

  clone() {
    return new Icon(
      this.path,
      this.viewbox[2],
      this.viewbox[3],
      this.width,
      this.height,
      this.attribute
    );
  }

  private _path: SVGPathElement;

  get path() {
    return this._path.getAttribute("d")!;
  }

  set path(value: string) {
    this._path.setAttribute("d", value);
  }

  get width(): string {
    return this.element.getAttribute("width")!;
  }

  set width(value: number | string) {
    this.element.setAttribute("width", value.toString());
  }

  get height(): string {
    return this.element.getAttribute("height")!;
  }

  set height(value: number | string) {
    this.element.setAttribute("height", value.toString());
  }
}
