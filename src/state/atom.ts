import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

import { SettingType, UserSocketType } from "@/types/types";

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

export const settings = atom<SettingType>({
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

    info: false,
    users: false,
    message: false,
    activities: false,
    setting: false,
  },
  // effects_UNSTABLE: [persistAtom],
});

export const rightBoxAtom = atom<boolean>({
  key: "rightBoxAtom",
  default: false,
});

export const joined = atom<"joined" | "joining" | "leaved" | "wrongcode">({
  key: "joined",
  default: "joined",
});

export const tracksAtom = atom<UserSocketType[]>({
  key: "tracksAtom",
  default: [],
});
