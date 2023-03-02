import Component from "../core/Component";
import Video from "../core/Video";
import { generate, pick, shuffle } from "../utils/utils";
import Vignette from "./Vignette";

export default class Stream extends Component<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"));
    this.classes = "stream";
    for (const video of this.videos) {
      video.isMuted = true;
      video.isHidden = true;
    }
    this.append(...this.videos, this.vignette);

    this.updateVideo = this.updateVideo.bind(this);
    this.initialize();
  }

  readonly vignette = new Vignette();

  readonly videos = [new Video(), new Video()];

  private currentVideoIndex = 0;
  private get nextVideoIndex() {
    return (this.currentVideoIndex + 1) % this.videos.length;
  }

  get currentVideo() {
    return this.videos[this.currentVideoIndex];
  }

  get nextVideo() {
    return this.videos[this.nextVideoIndex];
  }

  private playlist = shuffle(videos);
  private index = 0;

  get videoUrl() {
    return this.playlist[this.index];
  }

  onVideoEnd() {
    this.index = (this.index + 1) % this.playlist.length;
    if (this.index === 0) this.playlist = shuffle(videos);
  }

  async initialize() {
    try {
      await this.currentVideo.load(pick(videos), "anonymous");
      this.updateVideo();
    } catch {
      this.initialize();
    }
  }

  async updateVideo() {
    const video = this.currentVideo;
    const next = this.nextVideo;

    next.isHidden = true;
    video.isHidden = false;

    this.onVideoEnd();
    this.nextVideo.load(this.videoUrl, "anonymous");

    video.rate = 1.25;

    video.once("ended", this.updateVideo);
    video.play();

    this.currentVideoIndex = this.nextVideoIndex;
  }
}

const videos = [
  "https://blfunex.github.io/videos/blue.mp4",
  ...generate(46, (i) => `https://blfunex.github.io/videos/pexels/${i}.mp4`),
];
