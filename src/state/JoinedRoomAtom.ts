import { atom } from "recoil";

import { MeetType } from "@/types/types";
import { ReactNode } from "react";

export const meetDetailsAtom = atom<MeetType | null>({
  key: "meetDetailsAtom",
  default: null,
});