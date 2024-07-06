import { UserSocketType } from "@/types/types";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Socket } from "socket.io-client";

const localStorage = typeof window !== `undefined` ? window.localStorage : null;

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: localStorage!,
  converter: JSON,
});

export const settingsState = atom({
  key: "settingsState",
  default: false,
});

export const settings = atom<{
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
}>({
  key: "settings",
  default: {
    microphone: undefined,
    speaker: undefined,
    camera: undefined,
    screen: undefined,
    sendLogs: true,
    leaveEmptyCalls: true,
    cameraState: true,
    microphoneState: true,
    screenState: false,
    caption: false,
    emojies: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export const mediaDevices = atom<{
  microphone: { value: MediaDeviceInfo; label: string }[];
  speaker: { value: MediaDeviceInfo; label: string }[];
  camera: { value: MediaDeviceInfo; label: string }[];
  screen: { value: MediaDeviceInfo; label: string }[];
}>({
  key: "mediaDevices",
  default: {
    microphone: [],
    speaker: [],
    camera: [],
    screen: [],
  },
});

export const joined = atom<"joined" | "joining" | "leaved" | "wrongcode">({
  key: "joined",
  default: "joining",
});

export const tracksAtom = atom<UserSocketType[]>({
  key: "tracksAtom",
  default: [],
});
