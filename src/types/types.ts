import { Router } from "next/router";

export type UserType =
  | {
      image?: string | undefined | null;
      name?: string | undefined | null;
      email?: string | undefined | null;
    }
  | undefined;

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export type RoomSettings = {
  shareScreen: boolean;
  sendChatMessage: boolean;
  sendReaction: boolean;
  turnOnMic: boolean;
  turnOnVideo: boolean;
  hostMustJoinBeforeAll: boolean;
  access: "open" | "trusted";
};

export type PeerDetailsType = {
  name: string;
  email: string;
  image?: string;

  isAdmin: boolean;

  audio?: boolean;
  video?: boolean;
  screen?: boolean;

  hand?: boolean;
};

export type MeetType = {
  router: Router | null;
  peers: string[];
  users: PeerDetailsType[];
  admin: PeerDetailsType;
  settings: RoomSettings;
  started: boolean;
  expire: number;
};
