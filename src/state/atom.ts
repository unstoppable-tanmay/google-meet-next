import { atom } from "recoil";
// import { recoilPersist } from "recoil-persist";

// const { persistAtom } = recoilPersist({
//   key: "recoil-persist",
//   storage: localStorage,
//   converter: JSON,
// });

export const settingsState = atom({
  key: "settingsState",
  default: false,
});

export const settings = atom<{
  microphone: MediaDeviceInfo | undefined;
  speaker: MediaDeviceInfo | undefined;
  camera: MediaDeviceInfo | undefined;
  sendLogs: boolean;
  leaveEmptyCalls: boolean;
}>({
  key: "settings",
  default: {
    microphone: undefined,
    speaker: undefined,
    camera: undefined,
    sendLogs: true,
    leaveEmptyCalls: true,
  },
});
