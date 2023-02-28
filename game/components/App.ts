import Button from "../core/Button";
import Root from "../core/Root";
import ToggleButton from "../core/ToggleButton";
import Video from "../core/Video";
import { pick } from "../utils/fns";
import AppState from "../states/AppState";

export default class App extends Root {
  readonly followBtn = new ToggleButton("Follow", "Unfollow");
  readonly likeBtn = new Button("Like");
  readonly shareBtn = new Button("Share");
  readonly videos = [
    new Video({
      muted: true,
      hidden: true,
    }),
    new Video({
      muted: true,
      hidden: true,
    }),
  ];
  private currentVideoIndex = 0;
  private get nextVideoIndex() {
    return (this.currentVideoIndex + 1) % this.videos.length;
  }

  readonly state = new AppState();

  constructor() {
    super();

    const { state, followBtn, likeBtn, shareBtn } = this;

    followBtn.checked = state.following;
    followBtn.on("change", (event: CustomEvent) => {
      state.following = event.detail;
    });

    for (const video of this.videos) {
      video.style = {
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        backgroundColor: "black",
        position: "absolute",
        inset: "0",
        zIndex: "-1",
      };
    }

    this.append(followBtn, likeBtn, shareBtn, ...this.videos);

    this.updateVideo = this.updateVideo.bind(this);
    this.initialize();
  }

  get currentVideo() {
    return this.videos[this.currentVideoIndex];
  }

  get nextVideo() {
    return this.videos[this.nextVideoIndex];
  }

  async updateVideo() {
    const video = this.currentVideo;
    const next = this.nextVideo;

    next.isHidden = true;
    video.isHidden = false;

    this.nextVideo.load(pick(videos), "anonymous");

    video.once("ended", this.updateVideo);
    video.play();

    this.currentVideoIndex = this.nextVideoIndex;
  }

  async initialize() {
    await this.currentVideo.load(pick(videos), "anonymous");
    this.updateVideo();
  }
}

const pexels = [
  // "https://blfunex.github.io/videos/pexels/0.mp4",
  // "https://blfunex.github.io/videos/pexels/1.mp4",
  "https://blfunex.github.io/videos/pexels/2.mp4",
  "https://blfunex.github.io/videos/pexels/3.mp4",
  "https://blfunex.github.io/videos/pexels/4.mp4",
  "https://blfunex.github.io/videos/pexels/5.mp4",
  "https://blfunex.github.io/videos/pexels/6.mp4",
  // "https://blfunex.github.io/videos/pexels/7.mp4",
  // "https://blfunex.github.io/videos/pexels/8.mp4",
  // "https://blfunex.github.io/videos/pexels/9.mp4",
  "https://blfunex.github.io/videos/pexels/10.mp4",
  "https://blfunex.github.io/videos/pexels/11.mp4",
];

const videos = ["https://blfunex.github.io/videos/blue.mp4", ...pexels];
