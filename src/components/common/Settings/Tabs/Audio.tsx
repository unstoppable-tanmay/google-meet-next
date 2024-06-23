import { mediaDevices, settings } from "@/state/atom";
import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";
import Sound from "../../Sound";

const Audio = () => {
  const [setting, setSettings] = useRecoilState(settings);
  const [mediaDevice, setMediaDevices] = useRecoilState(mediaDevices);
  const audioRef = useRef<HTMLAudioElement>(null);
  
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

  
  // Add Audio
  useEffect(() => {
    const audioElement = audioRef.current;

    const addAudio = async () => {
      if (audioRef === null || setting.microphone?.deviceId === undefined)
        return;

      if (!open) {
        if (audioElement && audioElement.srcObject) {
          const stream = audioElement.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: setting.microphone?.deviceId },
        });
        if (audioElement!.srcObject !== stream) {
          audioElement!.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing audio stream:", error);
      }
    };
    addAudio();

    return () => {
      if (audioElement && audioElement.srcObject) {
        const stream = audioElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setting.microphone]);
  return (
    <>
      <div className="item flex flex-col gap-1">
        <div className="heading text-[#3583eb] text-sm font-medium">
          Microphone
        </div>
        <div className="inputs flex items-center gap-6 justify-center md:justify-between flex-wrap">
          <Select
            key={"mic"}
            className="w-[150px] md:w-[250px] flex border-[.5px] focus:border-black/30"
            defaultValue={
              setting.microphone
                ? {
                    value: setting.microphone,
                    label: setting.microphone.label,
                  }
                : mediaDevice.microphone[0]
            }
            onChange={(e) => {
              setSettings({ ...setting, microphone: e?.value });
            }}
            options={mediaDevice.microphone}
          />
          <Sound />
        </div>
      </div>
      <div className="item flex flex-col gap-1">
        <div className="heading text-[#3583eb] text-sm font-medium">
          Speaker
        </div>
        <div className="inputs flex items-center gap-6 justify-center md:justify-between flex-wrap">
          <Select
            key={"speaker"}
            className="w-[150px] md:w-[250px] border-[.5px] focus:border-black/30"
            defaultValue={
              setting.speaker
                ? {
                    value: setting.speaker,
                    label: setting.speaker.label,
                  }
                : mediaDevice.speaker[0]
            }
            onChange={(e) => {
              setSettings({ ...setting, speaker: e?.value });
            }}
            options={mediaDevice.speaker}
          />
          <button className="test px-4 py-3 -ml-4 rounded-full hover:text-[#3583eb] hover:bg-[#3583eb]/5 text-sm">
            Test
          </button>
        </div>
      </div>
    </>
  );
};

export default Audio;
