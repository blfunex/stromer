/// <reference types="p5/global" />
import type * as p5 from "p5";
import LikeButton from "./buttons/LikeButton";
import ShareButton from "./buttons/ShareButton";
import Component from "./components/Component";
import SyncedFollowButton from "./buttons/SyncedFollowButton";
import RewardSystem from "./utils/RewardSystem";
import RewardedFollowButton from "./buttons/RewardedFollowButton";
import ShareDrawer from "./drawers/ShareDrawer";

let video: p5.MediaElement & p5.Element;
let rewards: RewardSystem;

function setup() {
  frameRate(30);
  createCanvas(400, 720);

  Component.setup();

  noLoop();
  video = createVideo(
    "https://blfunex.github.io/bullshit/blue.mp4",
    onVideoLoad
  ) as typeof video;

  rewards = new RewardSystem();
  const shareDrawer = new ShareDrawer();

  const follow = new RewardedFollowButton(rewards);
  const like = new LikeButton(rewards);
  const share = new ShareButton(shareDrawer);
}

function onVideoLoad() {
  loop();
  video.size(width, height);
  video.loop();
  video.volume(0);
  video.style("object-fit", "cover");
  video.style("object-position", "center");
  video.style("background-color", "black");
  video.style("z-index", "-1");
  video.style("pointer-events", "none");
  video.style("opacity", "0.1");
  video.play();
}

function draw() {
  // @ts-ignore
  clear();
  rewards.update();
}

// @ts-ignore
window.setup = setup;
// @ts-ignore
window.draw = draw;

export {};
