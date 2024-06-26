"use client";

import JoinRoom from "@/components/room/JoinRoom";
import JoinedRoom from "@/components/room/JoinedRoom";
import { isValidRoomId } from "@/lib/room-id";
import { joined } from "@/state/atom";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Page = ({ params }: { params: { room: string } }) => {
  const room = params.room;
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [pageTransition, setPageTransition] = useState(false);

  const [join, setJoin] = useRecoilState(joined);

  useEffect(() => {
    if (!isValidRoomId(room)) {
      setLoadingMessage("Invalid Room Code");
      router.replace("/");
    } else {
      setPageLoading(false);
    }
  }, [room, router, setJoin]);

  return (
    <AnimatePresence mode="wait">
      {pageLoading ? (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          {loadingMessage}
        </section>
      ) : join == "joined" ? (
        <motion.div className="wrapper wrapper" key={"zsasdda"}>
          <motion.div
            exit={{ opacity: [0, 0.5, 0.7, 1, 1, 1] }}
            transition={{ duration: 2 }}
            className="layer w-full h-full bg-black absolute pointer-events-none opacity-0 flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000]"
          >
            Leaving...
          </motion.div>
          <JoinedRoom />
        </motion.div>
      ) : join == "joining" ? (
        <motion.div className="wrapper wrapper" key={"zsda"}>
          <motion.div
            exit={{ opacity: [0, 0, 0, 1, 1, 1, 1] }}
            transition={{ duration: 2 }}
            className="layer w-full h-full bg-black absolute pointer-events-none opacity-0 flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000]"
          >
            Joining...
          </motion.div>
          <JoinRoom />
        </motion.div>
      ) : join == "leaved" ? (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          Leaved
          <button
            className="my-2 px-3 py-1.5 rounded-md border-none outline-none"
            onClick={(e) => setJoin("joining")}
          >
            Return
          </button>
        </section>
      ) : join == "wrongcode" ? (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          WrongCode
          <button
            className="my-2 px-3 py-1.5 rounded-md border-none outline-none"
            onClick={(e) => setJoin("joining")}
          >
            Return
          </button>
        </section>
      ) : (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          Back Nothing Here
          <button
            className="my-2 px-3 py-1.5 rounded-md border-none outline-none"
            onClick={(e) => setJoin("joining")}
          >
            Return
          </button>
        </section>
      )}
    </AnimatePresence>
  );
};

export default Page;
