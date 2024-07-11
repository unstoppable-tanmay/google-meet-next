// https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerOptions

import { ProducerOptions } from "mediasoup-client/lib/types";

// https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
export let video_params: ProducerOptions = {
  // mediasoup params
  encodings: [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

export let audio_params: ProducerOptions = {
  // mediasoup params
  codec: {
    kind: "audio",
    mimeType: "audio/opus",
    preferredPayloadType: 111,
    clockRate: 48000,
    channels: 2,
  },
};
