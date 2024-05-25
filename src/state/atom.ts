import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: localStorage,
  converter: JSON,
});

export const settingsState = atom({
  key: "settingsState",
  default: false,
});

export const settings = atom({
  key: "settings",
  default: {
    microphone: {},
    speaker: {},
    camera: {},
    sendLogs: true,
    leaveEmptyCalls: true,
  },
  effects_UNSTABLE: [persistAtom],
});
