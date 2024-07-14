import { atom } from "recoil";

import { MeetType } from "@/types/types";

export const meetDetailsAtom = atom<MeetType | null>({
  key: "meetDetailsAtom",
  default: null,
});
