import { tracksAtom } from "@/state/atom";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";
import { PeerDetailsType, UserSocketType } from "@/types/types";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

// function createVideoElement(stream: MediaStream): HTMLVideoElement {
//   const videoElement = document.createElement("video");
//   videoElement.srcObject = stream;
//   videoElement.autoplay = true;
//   videoElement.muted = true; // Optional: Mute the video if needed
//   videoElement.playsInline = true; // Ensures the video plays inline on iOS

//   return videoElement;
// }

const VideoArea = () => {
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

  // useEffect(() => {
  //   tracks.map((e) => {
  //     videoContainerRef.current?.appendChild(
  //       createVideoElement(new MediaStream([e.tracks]))
  //     );
  //   });
  // }, [tracks]);

  return (
    <motion.section
      layout
      className="flex-1 h-full p-1 rounded-lg flex items-center justify-center"
    >
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center gap-6">
        {meetDetails?.peers.map((user, index) => {
          return <User key={user.socketId} user={user} />;
        })}
      </div>
    </motion.section>
  );
};

export default VideoArea;

const User = ({ user }: { user: PeerDetailsType }) => {
  const [tracks, setTracks] = useRecoilState(tracksAtom);
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(tracks, user.socketId);
    if (user.video && tracks.find((e) => e.socketId == user.socketId)) {
      videoElement.current!.srcObject = new MediaStream([
        tracks.find((track) => track.socketId == user.socketId)?.tracks!,
      ]);
    }
  }, [tracks, user]);
 
  return (
    <div className="rounded-xl py-10 bg-[#3c4043] flex items-center justify-center max-w-[300px] aspect-square overflow-hidden">
      <video
        autoPlay
        className="w-full h-full object-cover"
        ref={videoElement}
      ></video>
      <audio autoPlay className="hidden"></audio>
      {!user.audio && !user.video && (
        <div className="userImage w-[clamp(40px,60px,80px)] aspect-square rounded-full bg-red-300"></div>
      )}
    </div>
  );
};
