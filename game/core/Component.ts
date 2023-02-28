import Root from "./Root";

export default abstract class Component<T extends Element = Element> {
  private static mapping = new WeakMap<Element, Component>();

  static get<T extends Component<E>, E extends Element>(element: E): T | null {
    return (Component.mapping.get(element) as T) ?? null;
  }

  constructor(readonly element: T) {
    Component.mapping.set(element, this);
  }

  get data() {
    if (
      this.element instanceof HTMLElement ||
      this.element instanceof SVGElement
    ) {
      return this.element.dataset;
    } else {
      throw new Error("Element does not support dataset");
    }
  }

  set data(data: DOMStringMap) {
    if (
      this.element instanceof HTMLElement ||
      this.element instanceof SVGElement
    ) {
      Object.assign(this.element.dataset, data);
    } else {
      throw new Error("Element does not support dataset");
    }
  }

  get isHidden() {
    return this.element.hasAttribute("hidden");
  }

  set isHidden(hidden: boolean) {
    if (hidden) this.element.setAttribute("hidden", "");
    else this.element.removeAttribute("hidden");
  }

  on<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ) {
    this.element.addEventListener(event, listener, options);
  }

  off<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ) {
    this.element.removeEventListener(event, listener, options);
  }

  once<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | Omit<AddEventListenerOptions, "once">
  ) {
    const capture = typeof options === "boolean" ? options : options?.capture;
    const passive = typeof options === "boolean" ? false : options?.passive;
    this.element.addEventListener(event, listener, {
      capture,
      passive,
      once: true,
    });
  }

  emit<T extends Event>(event: T): boolean;

  emit(
    type: string,
    detail: null,
    bubbles?: boolean,
    cancelable?: boolean
  ): boolean;

  emit<T>(
    type: string,
    detail: T,
    bubbles?: boolean,
    cancelable?: boolean
  ): boolean;

  emit(
    type: string | object,
    detail?: unknown,
    bubbles = true,
    cancelable = false
  ) {
    if (typeof type === "object") {
      return this.element.dispatchEvent(type as Event);
    } else {
      const init = { bubbles, cancelable, detail };
      const event = new CustomEvent(type, init);
      return this.element.dispatchEvent(event);
    }
  }

  get classes() {
    return this.element.classList;
  }

  set classes(classes: DOMTokenList | string | string[]) {
    this.element.className = Array.isArray(classes)
      ? classes.join(" ")
      : classes.toString();
  }

  get style(): CSSStyleDeclaration {
    if (
      this.element instanceof SVGElement ||
      this.element instanceof HTMLElement
    ) {
      return this.element.style;
    } else {
      throw new Error("Cannot get style of non-HTML element");
    }
  }

  get rect() {
    return this.element.getBoundingClientRect();
  }

  createResizeObserver(callback: ResizeObserverCallback) {
    const observer = new ResizeObserver(callback);
    observer.observe(this.element);
    return observer;
  }

  set style(style: Partial<CSSStyleDeclaration>) {
    Object.assign(this.style, style);
  }

  get text() {
    return this.element.textContent ?? "";
  }

  set text(text: string) {
    this.element.textContent = text;
  }

  append(...children: Component[]) {
    for (const child of children) {
      this.element.append(child.element);
    }
  }

  appendTo(c: Component | Element) {
    if (c instanceof Component) {
      c.append(this);
    } else {
      c.append(this.element);
    }
  }

  remove() {
    this.element.remove();
  }

  get parent(): Component | null {
    const parent = this.element.parentElement;
    return parent ? Component.get(parent) : null;
  }

  get root(): Root {
    const root = document.body;
    if (!root) throw new Error("Root element not found");
    const component = Component.get(root);
    if (!component) throw new Error("Root component not found");
    return component as Root;
  }
}
