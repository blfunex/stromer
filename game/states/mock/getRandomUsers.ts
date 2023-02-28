import { loadJSON } from "../../utils/loading";
import User from "../User";

export default async function getRandomUsers(count: number) {
  const data = await loadJSON<RandomUser.Response>(
    `https://randomuser.me/api/?results=${count}`
  );

  return data.results.map(User.fromRandomUser);
}

export namespace RandomUser {
  export interface Name {
    title: string;
    first: string;
    last: string;
  }

  export interface Street {
    number: number;
    name: string;
  }

  export interface UserCoordinates {
    latitude: string;
    longitude: string;
  }

  export interface Timezone {
    offset: string;
    description: string;
  }

  export interface UserLocation {
    street: Street;
    city: string;
    state: string;
    country: string;
    postcode: string;
    coordinates: UserCoordinates;
    timezone: Timezone;
  }

  export interface UserLoginInfo {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  }

  export interface Dob {
    date: Date;
    age: number;
  }

  export interface UserRegistration {
    date: Date;
    age: number;
  }

  export interface UserId {
    name: string;
    value: string;
  }

  export interface UserAvatar {
    large: string;
    medium: string;
    thumbnail: string;
  }

  export interface UserResult {
    gender: string;
    name: Name;
    location: UserLocation;
    email: string;
    login: UserLoginInfo;
    dob: Dob;
    registered: UserRegistration;
    phone: string;
    cell: string;
    id: UserId;
    picture: UserAvatar;
    nat: string;
  }

  export interface RequestInfo {
    seed: string;
    results: number;
    page: number;
    version: string;
  }

  export interface Response {
    results: UserResult[];
    info: RequestInfo;
  }
}
