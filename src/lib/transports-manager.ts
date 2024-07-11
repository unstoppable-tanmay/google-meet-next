import { SettingType } from "@/types/types";
import { Socket } from "socket.io-client";
import { audio_params, video_params } from "./constants";

let videoTrack: MediaStreamTrack | null = null;
let audioTrack: MediaStreamTrack | null = null;
let screenTrack: MediaStreamTrack | null = null;

export const VideoManager = async (setting: boolean, socket: Socket,connectSendTransport:any) => {
  if (setting) {
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
          noiseSuppression: true,
        },
      });

      videoTrack = stream.getVideoTracks()[0];

      connectSendTransport(videoTrack, "video", socket.id!, video_params);
    } else {
      videoTrack.enabled = true;
    }
  } else {
    if (videoTrack) videoTrack.enabled = false;
  }
};

export const AudioManager = async (setting: boolean, socket: Socket,connectSendTransport:any) => {
  if (setting) {
    if (!audioTrack) {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      audioTrack = stream.getAudioTracks()[0];

      connectSendTransport(audioTrack, "audio", socket.id!, audio_params);
    } else {
      audioTrack.enabled = true;
    }
  } else {
    if (audioTrack) audioTrack.enabled = false;
  }
};

export const ScreenManager = async (setting: boolean, socket: Socket,connectSendTransport:any) => {
  if (setting) {
    if (!screenTrack) {
      const stream = await window.navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      screenTrack = stream.getVideoTracks()[0];

      connectSendTransport(screenTrack, "screen", socket.id!, video_params);
    } else {
      screenTrack.enabled = true;
    }
  } else {
    if (screenTrack) screenTrack.enabled = false;
  }
};
