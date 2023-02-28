import Component from "./Component";

interface GraphicsContextMap {
  "2d": [CanvasRenderingContext2D, CanvasRenderingContext2DSettings];
  webgl: [WebGLRenderingContext, WebGLContextAttributes];
  webgl2: [WebGL2RenderingContext, WebGLContextAttributes];
  bitmaprenderer: [
    ImageBitmapRenderingContext,
    ImageBitmapRenderingContextSettings
  ];
}

export default class Canvas<
  K extends keyof GraphicsContextMap
> extends Component<HTMLCanvasElement> {
  readonly context: GraphicsContextMap[K][0];

  constructor(id: K, options?: GraphicsContextMap[K][1]) {
    super(document.createElement("canvas"));
    const context = this.element.getContext(id, options);
    if (!context) throw new Error(`Failed to create ${id} context`);
    this.context = context;
  }

  get width() {
    return this.element.width;
  }

  set width(width: number) {
    this.element.width = width;
  }

  get height() {
    return this.element.height;
  }

  set height(height: number) {
    this.element.height = height;
  }

  async toBlob(type?: string, quality?: number): Promise<Blob | null> {
    return await new Promise<Blob | null>((resolve) => {
      this.element.toBlob(resolve, type, quality);
    });
  }

  toDataURL(type?: string, quality?: number): string {
    return this.element.toDataURL(type, quality);
  }
}
