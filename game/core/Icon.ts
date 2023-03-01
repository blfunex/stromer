import Vector from "./Vector";

export default class Icon extends Vector {
  constructor(
    path: string,
    srcWidth: number,
    srcHeight: number,
    dstWidth = "1rem",
    dstHeight = "1rem",
    style: "stroke" | "fill" = "fill"
  ) {
    super(`<svg viewBox="0 0 ${srcWidth} ${srcHeight}" width="${dstWidth}" height="${dstHeight}" xmlns="http://www.w3.org/2000/svg">
      <path d="${path}" ${style}="currentColor"></path>
    </svg>`);
  }
}
