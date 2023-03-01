import Button from "../core/Button";
import Root from "../core/Root";
import ToggleButton from "../core/ToggleButton";
import Video from "../core/Video";
import { pick } from "../utils/fns";
import AppState from "../states/AppState";
import HeartSystem from "./HeartSystem";
import SimulationLoop from "../interactive/SimulationLoop";
import CoinCounter from "./CoinCounter";
import AuthModal from "./AuthModal";

export default class App extends Root {
  readonly followBtn = new ToggleButton("Follow", "Unfollow");
  readonly shareBtn = new Button("Share");
  readonly resetBtn = new Button("Reset");
  readonly loop = new SimulationLoop(30);
  readonly hearts = new HeartSystem(this.loop);
  readonly counter = new CoinCounter();
  readonly auth = new AuthModal();

  readonly videos = [
    new Video({
      muted: true,
      hidden: true,
      autoplay: false,
    }),
    new Video({
      muted: true,
      hidden: true,
      autoplay: false,
    }),
  ];
  private currentVideoIndex = 0;
  private get nextVideoIndex() {
    return (this.currentVideoIndex + 1) % this.videos.length;
  }

  readonly state = new AppState();

  constructor() {
    super();

    const { state, followBtn, shareBtn, resetBtn, hearts, counter, auth } =
      this;

    const rewards = {
      viewership: 1,
      signup: 500,
      following: 100,
      sharing: 200,
      liking: 5,
      chat: 50,
    };

    followBtn.checked = state.app.following;
    followBtn.enableClick = state.app.loggedIn;
    followBtn.on("change", (event: CustomEvent) => {
      state.app.following = event.detail;
      if (!state.app.rewardedForFollowing) {
        state.app.rewardedForFollowing = true;
        state.app.coins += rewards.following;
      }
    });

    followBtn.on("click", () => {
      if (!enforceLogin()) return;
      followBtn.enableClick = true;
    });

    shareBtn.on("click", async () => {
      if (navigator.share === undefined) {
        alert(
          "Sharing is not supported on this browser :(\nYou will get 10 coins for attempting to share.\nTry with a more modern browser next time.\nSorry!"
        );

        state.app.coins += rewards.sharing;
      } else {
        await navigator.share({
          title: "Be a cool stromer!",
          text: "Check out this cool stream.",
          url: "https://blfunex.github.io/stromer/",
        });

        state.app.coins += rewards.sharing;
      }
    });

    counter.count = state.app.coins;

    hearts.button.on("click", () => {
      if (!enforceLogin()) return;
      counter.count = state.app.coins += rewards.liking;
    });
    hearts.enableClick = state.app.loggedIn;

    auth.on("signup", () => {
      state.app.loggedIn = true;
      counter.count = state.app.coins += rewards.signup;
    });

    auth.on("login", () => {
      state.app.loggedIn = true;
    });

    function enforceLogin() {
      if (state.app.loggedIn) return true;
      auth.open("login");
      return false;
    }

    setInterval(() => {
      counter.count = state.app.coins += rewards.viewership;
    }, 5000);

    for (const video of this.videos) {
      video.style = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        backgroundColor: "black",
        position: "absolute",
        inset: "0",
        zIndex: "-1",
      };
    }

    resetBtn.on("click", () => {
      state.reset();
      followBtn.checked = state.app.following;
      followBtn.enableClick = state.app.loggedIn;
      hearts.enableClick = state.app.loggedIn;
      counter.count = 0;
    });

    resetBtn.classes = "debug-button";

    this.append(
      ...this.videos,
      followBtn,
      shareBtn,
      resetBtn,
      counter,
      hearts.canvas,
      hearts.button,
      auth
    );

    // auth.open("login");

    // If on mobile on first click go to fullscreen mode
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      (window.onresize = () => {
        const vh = screen.height - 300;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      })();
      if (!state.app.knowsHowToFullscreen) {
        alert("Double tap to go fullscreen!");
        state.app.knowsHowToFullscreen = true;
      }
      document.body.addEventListener("dblclick", () => {
        if (document.fullscreenElement === null) {
          document.body.requestFullscreen();
        }
      });
    }

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

    video.rate = 1.25;

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
  // "https://blfunex.github.io/videos/pexels/5.mp4",
  "https://blfunex.github.io/videos/pexels/6.mp4",
  // "https://blfunex.github.io/videos/pexels/7.mp4",
  // "https://blfunex.github.io/videos/pexels/8.mp4",
  // "https://blfunex.github.io/videos/pexels/9.mp4",
  "https://blfunex.github.io/videos/pexels/10.mp4",
  "https://blfunex.github.io/videos/pexels/11.mp4",
];

const videos = [
  // "https://blfunex.github.io/videos/blue.mp4",
  ...pexels,
]
  .sort(() => Math.random() - 0.5)
  .slice(0, 3);
