import { Router } from "next/router";

export type UserType =
  | {
      image?: string | undefined | null;
      name?: string | undefined | null;
      email?: string | undefined | null;
    }
  | undefined;

export type UserSocketType = {
  socketId: string;
  name: string;
  image?: string;
  tracks: MediaStreamTrack;
  type: "audio" | "video" | "screen";
};

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export type RoomSettings = {
  hostManagement: boolean;
  shareScreen: boolean;
  sendChatMessage: boolean;
  sendReaction: boolean;
  turnOnMic: boolean;
  turnOnVideo: boolean;
  hostMustJoinBeforeAll: boolean;
  access: "open" | "trusted";
};

export type PeerDetailsType = {
  socketId?: string;

  name: string;
  email: string;
  image?: string;

  audio: boolean;
  video: boolean;
  screen: boolean;

  hand: boolean;
};

export type AdminType = {
  name: string;
  email: string;
  image?: string;
};

export type MeetType = {
  peers: PeerDetailsType[];
  raisedPeers: PeerDetailsType[];
  askingpeers: PeerDetailsType[];
  allowedPeers: PeerDetailsType[];
  admin: AdminType;
  settings: RoomSettings;
  started: boolean;
  expire: number;
};

export type SettingType = {
  microphone: MediaDeviceInfo | undefined;
  speaker: MediaDeviceInfo | undefined;
  camera: MediaDeviceInfo | undefined;
  screen: MediaDeviceInfo | undefined;
  sendLogs: boolean;
  leaveEmptyCalls: boolean;
  cameraState: boolean;
  microphoneState: boolean;
  screenState: boolean;
  caption: boolean;
  emojies: boolean;

  info: boolean;
  users: boolean;
  message: boolean;
  activities: boolean;
  setting: boolean;
};
