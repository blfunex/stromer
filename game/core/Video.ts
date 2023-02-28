import Media, { MediaInit } from "./Media";

export default class Video extends Media<HTMLVideoElement> {
  constructor(init?: MediaInit) {
    super(document.createElement("video"), init);
    this.element.playsInline = true;
  }
}
