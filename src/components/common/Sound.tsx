import { settings } from "@/state/atom";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

const Sound = () => {
  const [setting, setSetting] = useRecoilState(settings);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [level, setLevel] = useState(0);

  const mapRange = (value: number, minOutput: number, maxOutput: number) => {
    const minInput = 0;
    const maxInput = 150;
    return (
      ((value - minInput) * (maxOutput - minOutput)) / (maxInput - minInput) +
      minOutput
    );
  };

  useEffect(() => {
    let stream: MediaStream;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let interval: NodeJS.Timeout;

    const getVolume = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: setting.microphone?.deviceId },
      });

      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 32;
      microphone.connect(analyser);

      interval = setInterval(() => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        // Calculate average volume
        const averageVolume =
          array.reduce((acc, val) => acc + val, 0) / array.length;

        // Calculate sum of amplitudes
        // const sumOfAmplitudes = array.reduce((acc, val) => acc + val, 0);
        // console.log(averageVolume,mapRange(averageVolume, 0, 50))
        setLevel(mapRange(averageVolume, 0, 20));
      }, 150);

      return stream;
    };

    getVolume();

    return () => {
      audioContext && audioContext.close();
      stream && stream.getTracks().forEach((track) => track.stop());
      analyser && analyser.disconnect();
      interval && clearInterval(interval);

      const closeAll = async () => {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: setting.microphone?.deviceId },
        });

        stream.getTracks().forEach((track) => track.stop());
      };
      closeAll();
    };
  }, [setting.microphone]);

  return (
    <div className="sound rounded-full bg-blue-500 flex w-7 aspect-square items-center justify-center gap-1">
      <motion.div
        style={{ height: level / 2 }}
        className="1 w-[3px] flex-shrink-0 h-[3px] min-h-[3px] max-h-[50%] bg-white rounded-[10px]"
      ></motion.div>
      <motion.div
        style={{ height: level }}
        className="2 w-[4px] flex-shrink-0 h-[3px] min-h-[3px] max-h-[80%] bg-white rounded-[10px]"
      ></motion.div>
      <motion.div
        style={{ height: level / 3 }}
        className="3 w-[3px] flex-shrink-0 h-[3px] min-h-[3px] max-h-[40%] bg-white rounded-[10px]"
      ></motion.div>
    </div>
  );
};

export default Sound;
