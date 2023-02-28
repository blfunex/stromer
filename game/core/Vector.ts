import Component from "./Component";

const template = document.createElement("template");

export default class Vector extends Component<SVGSVGElement> {
  constructor(svg: string) {
    template.innerHTML = svg;
    const node = template.content.firstChild?.cloneNode(true) as SVGSVGElement;
    if (!node) throw new Error("Invalid SVG");
    super(node);
  }
}
