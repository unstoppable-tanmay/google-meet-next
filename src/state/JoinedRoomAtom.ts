import { atom } from "recoil";

import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";
import { MeetType } from "@/types/types";

export const meetDetailsAtom = atom<MeetType | null>({
  key: "meetDetailsAtom",
  default: null,
});
