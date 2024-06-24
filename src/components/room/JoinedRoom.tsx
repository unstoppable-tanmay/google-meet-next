import React, { useEffect, useState } from "react";
import BottomBar from "./components/BottomBar";

import { joined } from "@/state/atom";
import { useRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";

const JoinedRoom = () => {
  const [join, setJoin] = useRecoilState(joined);

  const [loading, setLoading] = useState(true);

  // Joining Logic
  useEffect(() => {
    // JoinRoom()

    return () => {
      // setJoin(false);
    };
  }, [setJoin]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key={"aisudhnasb"}
          exit={{ opacity: [1,1,0] }}
          transition={{ duration: 1 }}
          className="layer w-screen h-screen bg-black pointer-events-none flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000] absolute"
        >
          Joining...
        </motion.div>
      ) : (
        <section className="w-full h-screen overflow-hidden bg-[#202124] flex flex-col">
          <div className="video-area flex-1"></div>
          <BottomBar />
        </section>
      )}
    </AnimatePresence>
  );
};

export default JoinedRoom;
