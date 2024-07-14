import { useMediaStream } from "@/provider/MediaProvider";
import { settings } from "@/state/atom";
import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [setting, setSettings] = useRecoilState(settings);

  const {
    cameras,
    microphones,
    screens,
    speakers,
    getAudioStream,
    getScreenStream,
    getVideoStream,
    audioStream,
    screenStream,
    videoStream,
    stopAudioStream,
    stopScreenStream,
    stopVideoStream,
  } = useMediaStream();

  // Add Camera
  useEffect(() => {
    const videoElement = videoRef.current;

    const addVideo = async () => {
      if (videoRef === null || setting.camera?.deviceId === undefined) return;

      if (!open) {
        return stopVideoStream(setting.camera.deviceId);
      }

      try {
        if (videoElement) {
          videoElement.srcObject = await getVideoStream(
            setting.camera.deviceId
          );
        }
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };
    addVideo();

    return () => {
      stopVideoStream(setting.camera?.deviceId);
    };
  }, [setting.camera, getVideoStream, stopVideoStream]);

  return (
    <>
      <div className="item flex flex-col gap-1">
        <div className="heading text-[#3583eb] text-sm font-medium">Camera</div>
        <div className="inputs flex items-center gap-6 justify-center md:justify-between flex-wrap">
          <Select
            key={"camera"}
            className="w-[150px] md:w-[250px] border-[.5px] focus:border-black/30"
            defaultValue={
              setting.camera
                ? {
                    value: setting.camera,
                    label: setting.camera.label,
                  }
                : cameras[0]
            }
            onChange={(e) => {
              setSettings({ ...setting, camera: e?.value });
            }}
            options={cameras}
          />
          <div className="camera-display w-[105px] aspect-[16/8.5] bg-black">
            <video
              className="w-full h-full object-cover rounded-sm"
              ref={videoRef}
              autoPlay
              playsInline
              width={"100%"}
            ></video>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
