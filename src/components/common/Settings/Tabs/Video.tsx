import { mediaDevices, settings } from "@/state/atom";
import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [setting, setSettings] = useRecoilState(settings);
  const [mediaDevice, setMediaDevices] = useRecoilState(mediaDevices);

  // Get Devices
  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const micDevices = devices.filter((e) => e.kind == "audioinput");
      const speakerDevices = devices.filter((e) => e.kind == "audiooutput");
      const cameraDevices = devices.filter((e) => e.kind == "videoinput");

      setMediaDevices({
        microphone: micDevices.map((e) => ({ value: e, label: e.label })),
        speaker: speakerDevices.map((e) => ({ value: e, label: e.label })),
        camera: cameraDevices.map((e) => ({ value: e, label: e.label })),
      });

      setSettings((prev) => ({
        ...prev,
        microphone: micDevices[0],
        speaker: speakerDevices[0],
        camera: cameraDevices[0],
      }));
    };
    getDevices();
  }, [setMediaDevices, setSettings]);

  // Add Camera
  useEffect(() => {
    const videoElement = videoRef.current;

    const addVideo = async () => {
      if (videoRef === null || setting.camera?.deviceId === undefined) return;

      if (!open) {
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: setting.camera?.deviceId },
        });
        if (videoElement!.srcObject !== stream) {
          videoElement!.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };
    addVideo();

    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setting.camera]);

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
                : mediaDevice.camera[0]
            }
            onChange={(e) => {
              setSettings({ ...setting, camera: e?.value });
            }}
            options={mediaDevice.camera}
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
