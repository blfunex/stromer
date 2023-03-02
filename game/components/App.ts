import Button from "../core/Button";
import Root from "../core/Root";
import { wait } from "../utils/utils";
import AppState from "../states/AppState";
import HeartSystem from "./HeartSystem";
import SimulationLoop from "../interactive/SimulationLoop";
import CoinCounter from "./CoinCounter";
import AuthModal from "./AuthModal";
import StreamerInfo from "./StreamerInfo";
import InteractionParticles from "./InteractionParticles";
import CoinParticles from "./CoinParticles";
import Stream from "./Stream";
import ResetButton from "./ResetButton";
import LeaderBoard from "./LeaderBoard";
import LeaderBoardButton from "./LeaderBoardButton";

const rewards = {
  viewership: 1,
  signup: 500,
  signin: 50,
  following: 100,
  sharing: 200,
  liking: 5,
  chat: 50,
};

export default class App extends Root {
  constructor() {
    super();
    this.markup();
    this.events();
  }

  readonly leaderboard = new LeaderBoard(this);
  readonly showLBBtn = new LeaderBoardButton();
  readonly shareBtn = new Button("Share");
  readonly resetBtn = new ResetButton(this);
  readonly loop = new SimulationLoop(30);
  readonly hearts = new HeartSystem(this.loop);
  readonly interaction = new InteractionParticles(
    this.loop,
    this.hearts.context
  );
  readonly coins = new CoinParticles(this.loop, this.hearts.context);
  readonly state = new AppState();
  readonly counter = new CoinCounter(
    this.state.app.coins,
    this.coins,
    this.interaction
  );
  readonly auth = new AuthModal();
  readonly streamer = new StreamerInfo();

  readonly stream = new Stream();

  private markup() {
    const state = this.state;
    const followBtn = this.streamer.followButton;
    const stramer = this.streamer;

    state.ready.then(() => {
      stramer.streamer = state.users.streamer!;
      this.leaderboard.populate();
      this.leaderboard.open();
    });

    followBtn.checked = state.app.following;
    followBtn.enableClick = state.app.loggedIn;
    this.hearts.enableClick = state.app.loggedIn;

    this.append(
      this.stream,
      this.streamer,
      this.shareBtn,
      this.resetBtn,
      this.showLBBtn,
      this.counter,
      this.hearts.button,
      this.hearts.canvas,
      this.leaderboard,
      this.auth
    );
  }

  private events() {
    this.attachLeaderBoardEvents();
    this.attachHeartEvents();
    this.attachShareClick();
    this.attachFollowClick();
    this.attachAuthEvents();
    this.rescheduleCounterTick();
    this.attachCounterToState();
    this.interaction.attachMouseTracker();
    this.coins.attachMouseTracker();
    this.patchMobile();
  }

  private attachLeaderBoardEvents() {
    this.showLBBtn.on("click", () => this.leaderboard.open());
  }

  private attachHeartEvents() {
    this.hearts.canvas.on("resize", (e: CustomEvent) => {
      const [x, y] = e.detail as [number, number];
      const counter = this.counter;
      this.hearts.button.calculateCenterPosition(x, y);
      counter.calculateCenterPosition(x, y);
      this.coins.updateCoinPosition(counter.x, counter.y);
    });

    this.hearts.button.on("click", () => {
      if (!this.enforceLogin()) return;
      this.counter.add(rewards.liking);
    });
  }

  private attachCounterToState() {
    this.counter.on("change", (event: CustomEvent) => {
      this.state.app.coins = event.detail;
    });
  }

  private attachShareClick() {
    this.shareBtn.on("click", async () => {
      if (navigator.share === undefined) {
        alert(
          [
            "ℹ️ INFO:\n",
            "Sharing is not supported on this browser :(",
            "You will get 10 coins for attempting to share 💰.",
            "Try with a more modern browser next time.",
            "Sorry!",
          ].join("\n")
        );

        this.counter.add(10);
      } else {
        await navigator.share({
          title: "Be a cool stromer!",
          text: "Check out this cool stream.",
          url: "https://blfunex.github.io/stromer/",
        });

        this.counter.add(rewards.sharing);
      }
    });
  }

  private attachFollowClick() {
    const state = this.state;
    const followBtn = this.streamer.followButton;

    followBtn.on("change", async (event: CustomEvent) => {
      state.app.following = event.detail;
      if (state.app.following && !state.app.rewardedForFollowing) {
        await wait(200);
        this.counter.add(rewards.following);
        state.app.rewardedForFollowing = true;
      }
    });

    followBtn.on("click", () => {
      if (!this.enforceLogin()) return;
      followBtn.enableClick = true;
    });
  }

  async onReset() {
    const state = this.state;

    if (!state.app.knowsResetInfo) {
      if (
        !confirm(
          [
            "⚠️ WARNING:\n",
            "Are you sure you want to reset the prototype?",
            "This will reset your coins and progress.",
            "New mock data will be loaded.",
            "This is not a real app, so don't worry about it.",
            "⚠️ You will not see this message next reset attempt.",
          ].join("\n")
        )
      )
        return;

      state.app.knowsResetInfo = true;
    }

    await state.reset();
    this.streamer.streamer = state.users.streamer!;
    this.streamer.followButton.checked = state.app.following;
    this.streamer.followButton.enableClick = state.app.loggedIn;
    this.hearts.enableClick = state.app.loggedIn;
    this.hearts.reset();
    this.coins.reset();
    this.interaction.reset();
    this.counter.reset();

    this.rescheduleCounterTick();
  }

  private counterTickId: number | null = null;

  private rescheduleCounterTick() {
    if (this.counterTickId !== null) {
      clearInterval(this.counterTickId);
    }
    this.counterTickId = setInterval(() => {
      this.counter.tick();
    }, 10000);
  }

  private attachAuthEvents() {
    this.auth.on("signup", () => {
      this.state.app.loggedIn = true;
      this.counter.add(rewards.signup);
    });

    this.auth.on("login", () => {
      this.state.app.loggedIn = true;
      this.counter.add(rewards.signin);
    });
  }

  private enforceLogin() {
    const state = this.state;
    const auth = this.auth;

    if (state.app.loggedIn) return true;
    auth.open("signup");
    if (!state.app.knowsHowToLogin) {
      setTimeout(() => {
        alert(
          [
            "ℹ️ INFO:\n",
            "This is not a real app,",
            "you can use any credentials to login or signup.",
            "This just for prototyping purposes.",
            "Loging in is rewarded with only 50 coins,",
            "but signing up is rewarded with 500 coins.",
            "",
            "⚠️ You will not see this message next login attempt.",
          ].join("\n")
        );
        state.app.knowsHowToLogin = true;
      }, 100);
    }
    return false;
  }

  private patchMobile() {
    const state = this.state;
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
  }
}
