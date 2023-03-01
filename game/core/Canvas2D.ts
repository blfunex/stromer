import Canvas from "./Canvas";

export default class Canvas2D extends Canvas<"2d"> {
  constructor(options?: CanvasRenderingContext2DSettings) {
    super("2d", options);
  }
}
