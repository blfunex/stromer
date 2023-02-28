import Component from "./Component";

export default abstract class Root extends Component<HTMLBodyElement> {
  private static instance: Root;

  constructor() {
    super(document.body as HTMLBodyElement);
    if (Root.instance) throw new Error("Root already exists");
    Root.instance = this;
  }
}
