export function loadJSON<T>(input: RequestInfo, init?: RequestInit) {
  return fetch(input, init).then<T>(toJSON);
}

function toJSON(response: Response) {
  return response.json();
}
