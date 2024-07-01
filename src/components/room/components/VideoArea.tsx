import { motion } from "framer-motion";
import React from "react";

const VideoArea = ({
  users,
}: {
  users: {
    socketId: string;
    name: string;
    image?: string;
    tracks: MediaStreamTrack[];
  }[];
}) => {
  return (
    <motion.section layout className="flex-1 h-full p-1 rounded-lg flex items-center justify-center">
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center gap-6">
        {users.map((user, index) => {
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
