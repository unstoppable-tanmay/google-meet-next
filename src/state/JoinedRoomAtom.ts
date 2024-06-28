import { atom } from "recoil";

import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";

export const socketAtom = atom<Socket | null>({
  key: "socketAtom",
  default: null,
});

export const deviceAtom = atom<Device | null>({
  key: "deviceAtom",
  default: null,
});

export const rtpCapabilitiesAtom = atom<RtpCapabilities | null>({
  key: "rtpCapabilitiesAtom",
  default: null,
});

export const producerTransportAtom = atom<Transport | null>({
  key: "producerTransportAtom",
  default: null,
});

export const consumerTransportsAtom = atom<
  {
    consumerTransport: Transport;
    serverConsumerTransportId: string;
    producerId: string;
    consumer: Consumer;
  }[]
>({
  key: "consumerTransportsAtom",
  default: [],
});

export const consumingTransportsAtom = atom<string[]>({
  key: "consumingTransportsAtom",
  default: [],
});
