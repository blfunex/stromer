import type * as p5 from "p5";

let main: p5.Element;

export default abstract class Component {
  static setup() {
    main = createDiv();
    main.addClass("main");
  }

  constructor(readonly element: p5.Element, parent = main) {
    main.size(width, height);
    parent.child(this.element);
  }
}
