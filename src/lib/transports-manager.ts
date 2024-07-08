import { SettingType } from "@/types/types";
import { connectSendTransport } from "./helper";

let videoTrack: MediaStreamTrack | null = null;
let audioTrack: MediaStreamTrack | null = null;
let streamTrack: MediaStreamTrack | null = null;

export const VideoManager = async (setting: SettingType) => {
  if (setting.cameraState) {
    if (!videoTrack) {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            min: 640,
            max: 1920,
          },
          height: {
            min: 400,
            max: 1080,
          },
        },
      });

      videoTrack = stream.getVideoTracks()[0];

      connectSendTransport(videoTrack, "video");
    }
  } else {
    if (videoTrack) videoTrack.enabled = false;
  }
};
