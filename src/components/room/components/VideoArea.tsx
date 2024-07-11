import { useSocket } from "@/provider/SocketContext";
import { tracksAtom } from "@/state/atom";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";
import { PeerDetailsType, UserSocketType } from "@/types/types";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

const VideoArea = () => {
  const { socket } = useSocket();
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

  return (
    <motion.section
      layout
      className="flex-1 h-full p-1 rounded-lg flex items-center justify-center"
    >
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center gap-6">
        {meetDetails?.peers.map((user, index) => {
          return user.socketId != socket?.id ? (
            <User key={user.socketId} user={user} />
          ) : (
            <></>
          );
        })}
      </div>
    </motion.section>
  );
};

export default VideoArea;

const User = ({ user }: { user: PeerDetailsType }) => {
  const [tracks, setTracks] = useRecoilState(tracksAtom);
  const videoElement = useRef<HTMLVideoElement>(null);
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log(tracks, user.socketId);
    if (tracks.find((e) => e.socketId == user.socketId && e.type == "video")) {
      videoElement.current!.srcObject = new MediaStream([
        tracks.find(
          (track) => track.socketId == user.socketId && track.type == "video"
        )?.tracks!,
      ]);
    }
  }, [tracks, user]);

  useEffect(() => {
    console.log(tracks, user.socketId);
    if (tracks.find((e) => e.socketId == user.socketId && e.type == "audio")) {
      audioElement.current!.srcObject = new MediaStream([
        tracks.find(
          (track) => track.socketId == user.socketId && track.type == "audio"
        )?.tracks!,
      ]);
    }
  }, [tracks, user]);

  return (
    <div className="rounded-xl bg-[#3c4043] flex items-center justify-center max-w-[300px] aspect-square overflow-hidden">
      <video
        autoPlay
        className="w-full h-full object-cover"
        ref={videoElement}
      ></video>
      <audio ref={audioElement} autoPlay className="hidden"></audio>
      {!user.audio && !user.video && (
        <div className="userImage w-[clamp(40px,60px,80px)] aspect-square rounded-full bg-white/20"></div>
      )}
    </div>
  );
};
