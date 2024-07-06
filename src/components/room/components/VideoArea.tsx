import { tracksAtom } from "@/state/atom";
import { UserSocketType } from "@/types/types";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

function createVideoElement(stream: MediaStream): HTMLVideoElement {
  const videoElement = document.createElement("video");
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  videoElement.muted = true; // Optional: Mute the video if needed
  videoElement.playsInline = true; // Ensures the video plays inline on iOS

  return videoElement;
}

const VideoArea = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [tracks, setTracks] = useRecoilState(tracksAtom);

  useEffect(() => {
    tracks.map((e) => {
      videoContainerRef.current?.appendChild(
        createVideoElement(new MediaStream([e.tracks]))
      );
    });
  }, [tracks]);

  return (
    <motion.section
      layout
      className="flex-1 h-full p-1 rounded-lg flex items-center justify-center"
    >
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center gap-6">
        {tracks.map((user, index) => {
          return <User key={user.socketId} />;
        })}
      </div>
    </motion.section>
  );
};

export default VideoArea;

const User = () => {
  return (
    <div className="rounded-xl px-20 py-10 aspect-square bg-[#3c4043] flex items-center justify-center">
      <div className="userImage w-[clamp(40px,60px,80px)] aspect-square rounded-full bg-red-300"></div>
    </div>
  );
};
