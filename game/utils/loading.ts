export function loadJSON<T>(input: RequestInfo, init?: RequestInit) {
  return fetch(input, init).then<T>(toJSON);
}

function toJSON(response: Response) {
  return response.json();
}

export function loadAudio(url: string) {
  return new Promise<HTMLAudioElement>((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener("canplaythrough", () => resolve(audio));
    audio.addEventListener("error", reject);
    audio.src = url;
  });
}
