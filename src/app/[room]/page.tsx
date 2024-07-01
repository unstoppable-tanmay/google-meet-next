"use client";

import JoinRoom from "@/components/room/JoinRoom";
import JoinedRoom from "@/components/room/JoinedRoom";
import { isValidRoomId } from "@/lib/room-id";
import { joined } from "@/state/atom";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Page = ({ params }: { params: { room: string } }) => {
  const room = params.room;
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const [join, setJoin] = useRecoilState(joined);

  useEffect(() => {
    if (!isValidRoomId(room)) {
      setLoadingMessage("Invalid Room Code");
      setJoin("wrongcode");
    } else {
      checkRoom(room);
    }
  }, [room, router, setJoin]);

  const checkRoom = async (roomId: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/isMeetExist`,
      {
        params: {
          roomId,
        },
      }
    );

    if (response.status == 200 && response.data.data) {
    } else {
      setJoin("wrongcode");
    }
    setPageLoading(false);
  };

  return (
    <AnimatePresence mode="wait">
      {pageLoading ? (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          {loadingMessage}
        </section>
      ) : join == "joined" ? (
        <motion.div className="wrapper wrapper" key={"zsasdda"}>
          <motion.div
            exit={{ opacity: [0, 0.5, 0.7, 0.7, 0.7, 0.7] }}
            transition={{ duration: 2 }}
            className="layer w-full h-full bg-black absolute pointer-events-none opacity-0 flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000]"
          >
            Leaving . . .
          </motion.div>
          <JoinedRoom roomId={room} />
        </motion.div>
      ) : join == "joining" ? (
        <motion.div className="wrapper wrapper" key={"zsda"}>
          <motion.div
            exit={{ opacity: [0, 0, 0, 0.8, 0.8, 0.8, 0.8] }}
            transition={{ duration: 2 }}
            className="layer w-full h-full bg-black absolute pointer-events-none opacity-0 flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000]"
          >
            Joining . . .
          </motion.div>
          <JoinRoom roomId={room} />
        </motion.div>
      ) : join == "leaved" ? (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          Leaved
          <button
            className="my-2 px-3 py-1.5 rounded-md border-none outline-none"
            onClick={(e) => router.replace('/')}
          >
            Return
          </button>
        </section>
      ) : join == "wrongcode" ? (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          WrongCode
          <button
            className="my-2 px-3 py-1.5 rounded-md border-none outline-none"
            onClick={(e) => router.replace('/')}
          >
            Return
          </button>
        </section>
      ) : (
        <section className="w-screen h-screen flex items-center justify-center text-xl">
          Back Nothing Here
          <button
            className="my-2 px-3 py-1.5 rounded-md border-none outline-none"
            onClick={(e) => router.replace('/')}
          >
            Return
          </button>
        </section>
      )}
    </AnimatePresence>
  );
};

export default Page;
