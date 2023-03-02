import { loadAudio } from "../utils/loading";

const silentMp3 = new URL("./assets/silence.mp3", import.meta.url).href;

export default class SoundMaker {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private promises: Promise<HTMLAudioElement>[] = [];

  private hasAutoPlayPermission = false;

  constructor() {
    this.getAutoPlayPermission();
  }

  private async getAutoPlayPermission() {
    this.hasAutoPlayPermission = false;
    const slient = await loadAudio(silentMp3);
    return new Promise<void>((resolve) => {
      document.addEventListener(
        "click",
        () => {
          slient.play();
          this.hasAutoPlayPermission = true;
          resolve();
        },
        { once: true }
      );
    });
  }

  async loadSound(name: string, url: string, volume = 1) {
    const promise = loadAudio(url);
    this.promises.push(promise);
    const audio = await promise;
    audio.autoplay = false;
    audio.loop = false;
    audio.volume = volume;
    audio.preload = "auto";
    audio.addEventListener("ended", () => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.sounds[name] = audio;
  }

  play(name: string) {
    if (!this.hasAutoPlayPermission) return;
    const audio = this.sounds[name];
    if (audio) {
      const progress = audio.currentTime / audio.duration;
      if (progress > 0.75) {
        // If the sound is more than 75% done, restart it
        audio.currentTime = 0;
      }
      audio.play();
    }
  }
}
