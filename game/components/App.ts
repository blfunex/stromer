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

export default class App extends Root {
  readonly shareBtn = new Button("Share");
  readonly resetBtn = new Button("Reset Prototype");
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

  constructor() {
    super();

    const state = this.state;
    const stramer = this.streamer;
    const hearts = this.hearts;
    const counter = this.counter;
    const auth = this.auth;
    const followBtn = stramer.followButton;
    const shareBtn = this.shareBtn;
    const resetBtn = this.resetBtn;

    state.ready.then(() => {
      stramer.streamer = state.users.streamer!;
    });

    hearts.canvas.on("resize", (e: CustomEvent) => {
      const [x, y] = e.detail as [number, number];
      hearts.button.calculateCenterPosition(x, y);
      counter.calculateCenterPosition(x, y);
      this.coins.updateCoinPosition(counter.x, counter.y);
    });

    const rewards = {
      viewership: 1,
      signup: 500,
      signin: 50,
      following: 100,
      sharing: 200,
      liking: 5,
      chat: 50,
    };

    followBtn.checked = state.app.following;
    followBtn.enableClick = state.app.loggedIn;
    followBtn.on("change", async (event: CustomEvent) => {
      state.app.following = event.detail;
      if (state.app.following && !state.app.rewardedForFollowing) {
        await wait(200);
        counter.add(rewards.following);
        state.app.rewardedForFollowing = true;
      }
    });

    followBtn.on("click", () => {
      if (!enforceLogin()) return;
      followBtn.enableClick = true;
    });

    shareBtn.on("click", async () => {
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

        counter.add(10);
      } else {
        await navigator.share({
          title: "Be a cool stromer!",
          text: "Check out this cool stream.",
          url: "https://blfunex.github.io/stromer/",
        });

        counter.add(rewards.sharing);
      }
    });

    counter.on("change", (event: CustomEvent) => {
      state.app.coins = event.detail;
    });

    hearts.button.on("click", () => {
      if (!enforceLogin()) return;
      counter.add(rewards.liking);
    });
    hearts.enableClick = state.app.loggedIn;

    auth.on("signup", () => {
      state.app.loggedIn = true;
      counter.add(rewards.signup);
    });

    auth.on("login", () => {
      state.app.loggedIn = true;
      counter.add(rewards.signin);
    });

    function enforceLogin() {
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

    let counterInnterval = setInterval(() => {
      counter.tick();
    }, 5000);

    resetBtn.on("click", async () => {
      if (
        !confirm(
          [
            "⚠️ WARNING:\n",
            "Are you sure you want to reset the prototype?",
            "This will reset your coins and progress.",
            "New mock data will be loaded.",
            'You will be "logged out".',
            "This is not a real app, so don't worry about it.",
            "This will also reset info alerts.",
          ].join("\n")
        )
      )
        return;

      await state.reset();
      stramer.streamer = state.users.streamer!;
      followBtn.checked = state.app.following;
      followBtn.enableClick = state.app.loggedIn;
      hearts.enableClick = state.app.loggedIn;
      hearts.reset();
      this.coins.reset();
      this.interaction.reset();
      counter.reset();

      clearInterval(counterInnterval);
      counterInnterval = setInterval(() => {
        counter.tick();
      }, 10000);
    });

    resetBtn.classes = "debug-button";

    this.append(
      this.stream,
      stramer,
      shareBtn,
      resetBtn,
      counter,
      hearts.button,
      hearts.canvas,
      auth
    );

    this.interaction.attachMouseTracker();
    this.coins.attachMouseTracker();

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
