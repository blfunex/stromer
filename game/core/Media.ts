import Component from "./Component";

const READY_STATES = {
  none: 0,
  metadata: 1,
  data: 2,
  canplay: 3,
  canplaythrough: 4,
} as const;

const READY_STATES_MAP = {
  [READY_STATES.none]: "none",
  [READY_STATES.metadata]: "metadata",
  [READY_STATES.data]: "data",
  [READY_STATES.canplay]: "canplay",
  [READY_STATES.canplaythrough]: "canplaythrough",
} as const;

export type ReadyState = keyof typeof READY_STATES;

export interface MediaInit {
  autoplay?: boolean;
  controls?: boolean;
  hidden?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: boolean;
}

export default abstract class Media<
  T extends HTMLMediaElement
> extends Component<T> {
  constructor(
    element: T,
    {
      autoplay = false,
      controls = false,
      hidden = false,
      muted = false,
      loop = false,
    }: MediaInit = {}
  ) {
    super(element);
    this.isAutoplayEnabled = autoplay;
    this.isControlsVisible = controls;
    this.isHidden = hidden;
    this.isMuted = muted;
    this.isLooping = loop;
  }

  load(src: string | MediaSource, crossOrigin?: string) {
    if (crossOrigin) this.element.crossOrigin = crossOrigin;

    if (typeof src === "string") {
      this.element.src = src;
    } else if ("srcObject" in this.element) {
      this.element.srcObject = src;
    } else {
      // @ts-ignore
      this.element.src = URL.createObjectURL(src);
    }

    return new Promise<void>((resolve, reject) => {
      this.once("error", () =>
        reject(new Error(`Failed to load media: ${src}`))
      );
      this.once("loadedmetadata", () => resolve());
    });
  }

  get isAutoplayEnabled() {
    return this.element.autoplay;
  }

  set isAutoplayEnabled(autoplay: boolean) {
    this.element.autoplay = autoplay;
  }

  get isControlsVisible() {
    return this.element.controls;
  }

  set isControlsVisible(controls: boolean) {
    this.element.controls = controls;
  }

  showControls() {
    this.isControlsVisible = true;
  }

  hideControls() {
    this.isControlsVisible = false;
  }

  play() {
    return this.element.play();
  }

  pause() {
    this.element.pause();
  }

  get isMuted() {
    return this.element.muted;
  }

  set isMuted(muted: boolean) {
    this.element.muted = muted;
  }

  get volume() {
    return this.element.volume;
  }

  set volume(volume: number) {
    this.element.volume = volume;
  }

  get isPaused() {
    return this.element.paused;
  }

  get isPlaying() {
    return !this.isPaused;
  }

  get time() {
    return this.element.currentTime;
  }

  set time(time: number) {
    this.element.currentTime = time;
  }

  get duration() {
    return this.element.duration;
  }

  get isEnded() {
    return this.element.ended;
  }

  get isLooping() {
    return this.element.loop;
  }

  set isLooping(loop: boolean) {
    this.element.loop = loop;
  }

  get rate() {
    return this.element.playbackRate;
  }

  set rate(rate: number) {
    this.element.playbackRate = rate;
  }

  get readyState() {
    const state = this.element.readyState;
    const readyState = READY_STATES_MAP[state];
    if (readyState == null) throw new Error(`Unknown ready state: ${state}`);
    return readyState;
  }

  isReady(readyState: ReadyState) {
    const state = READY_STATES[readyState];
    return this.element.readyState >= state;
  }

  get buffered() {
    return this.element.buffered.end(0) / this.duration;
  }

  get played() {
    return this.time / this.duration;
  }
}
