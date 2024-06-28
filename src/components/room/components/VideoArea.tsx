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
    <motion.section layout className="flex-1 h-full p-1">
      {users.map((user, index) => {
        return (
          <motion.div
            key={user.socketId}
            className="rounded-lg bg-[#3c4043]"
          ></motion.div>
        );
      })}
    </motion.section>
  );
};

export default VideoArea;
