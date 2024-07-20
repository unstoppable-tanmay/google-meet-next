import { atom } from "recoil";

import { MeetType } from "@/types/types";
import { ReactNode } from "react";

// using on testing time
// {
//   peers: [],
//   admin: {
//     email: "iamunstoppableguy@gmail.com",
//     name: "Tanmay Kumar",
//     image: "",
//   },
//   settings: {
//     access: "trusted",
//     hostManagement: false,
//     hostMustJoinBeforeAll: false,
//     sendChatMessage: true,
//     sendReaction: true,
//     shareScreen: true,
//     turnOnMic: true,
//     turnOnVideo: true,
//   },
//   started: true,
//   expire: 124444,
// }

export const meetDetailsAtom = atom<MeetType | null>({
  key: "meetDetailsAtom",
  default: null,
});

export const messagesAtom = atom<{ message: string; user: string }[]>({
  key: "messagesAtom",
  default: [],
});

export const emojiesColorAtom = atom<
  | ""
  | "_dark-skin-tone"
  | "_medium-dark-skin-tone"
  | "_medium-skin-tone"
  | "_medium-light-skin-tone"
  | "_light-skin-tone"
>({
  key: "emojiesColorAtom",
  default: "",
});
