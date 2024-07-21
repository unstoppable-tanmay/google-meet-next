import { settings } from "@/state/atom";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

const Sound = ({ stream }: { stream?: MediaStream }) => {
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
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let interval: NodeJS.Timeout;

    const getVolume = async (stream: MediaStream) => {
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

    stream && getVolume(stream);

    return () => {
      audioContext && audioContext.close();
      stream && stream.getTracks().forEach((track) => track.stop());
      analyser && analyser.disconnect();
      interval && clearInterval(interval);
    };
  }, [setting.microphone, stream]);

  return stream ? (
    <div className="sound rounded-full bg-blue-500 flex w-6 aspect-square items-center justify-center gap-1">
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
  ) : (
    <div className="w-5 aspect-square">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
      >
        <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
      </svg>
    </div>
  );
};

export default Sound;
