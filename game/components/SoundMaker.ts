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
    this.sounds[name] = audio;
  }

  play(name: string) {
    if (!this.hasAutoPlayPermission) return;
    const audio = this.sounds[name];
    if (audio) {
      audio.currentTime = 0;
      try {
        audio.play();
      } catch {}
    }
  }
}
