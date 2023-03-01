import Component from "./Component";

const template = document.createElement("template");

export default class Vector extends Component<SVGSVGElement> {
  constructor(svg: string) {
    template.innerHTML = svg;
    const node = template.content.firstChild?.cloneNode(true) as SVGSVGElement;
    if (!node) throw new Error("Invalid SVG");
    super(node);
  }

  get viewbox(): readonly [x: number, y: number, w: number, h: number] {
    return ViewBox.fromElement(this.element);
  }

  set viewbox(rect: ViewBox) {
    ViewBox.toElement(this.element, rect);
  }
}

type ViewBox =
  | readonly [size: number]
  | readonly [w: number, h: number]
  | readonly [x: number, y: number, size: number]
  | readonly [x: number, y: number, w: number, h: number];

namespace ViewBox {
  export function fromElement(element: SVGSVGElement) {
    const { x, y, width, height } = element.viewBox.baseVal;
    return [x, y, width, height] as const;
  }

  export function toElement(element: SVGSVGElement, rect: ViewBox) {
    const x = rect.length > 2 ? rect[0] : 0;
    const y = rect.length > 2 ? rect[1] : 0;
    const width = rect.length > 2 ? rect[2] : rect[0];
    const height = rect.length > 2 ? rect[3] ?? rect[2] : rect[1] ?? rect[0];

    const box = element.viewBox.baseVal;

    box.x = x;
    box.y = y!;
    box.width = width!;
    box.height = height!;
  }
}
