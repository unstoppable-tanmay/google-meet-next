import { settings } from "@/state/atom";
import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";
import Sound from "../../Sound";
import { useMediaStream } from "@/provider/MediaProvider";

const Audio = () => {
  const [setting, setSettings] = useRecoilState(settings);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { microphones, speakers, getAudioStream, stopAudioStream } =
    useMediaStream();

  // Add Audio
  useEffect(() => {
    const audioElement = audioRef.current;

    const addAudio = async () => {
      if (audioRef === null || setting.microphone?.deviceId === undefined)
        return;

      if (!open) {
        return stopAudioStream(setting.microphone.deviceId);
      }

      try {
        if (audioElement)
          audioElement.srcObject = await getAudioStream(
            setting.microphone.deviceId
          );
      } catch (error) {
        console.error("Error accessing audio stream:", error);
      }
    };
    addAudio();

    return () => {
      stopAudioStream(setting.microphone?.deviceId);
    };
  }, [setting.microphone, getAudioStream, stopAudioStream]);

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
                : microphones[0]
            }
            onChange={(e) => {
              setSettings({ ...setting, microphone: e?.value });
            }}
            options={microphones}
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
                : speakers[0]
            }
            onChange={(e) => {
              setSettings({ ...setting, speaker: e?.value });
            }}
            options={speakers}
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
