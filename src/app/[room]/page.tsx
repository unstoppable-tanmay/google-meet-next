"use client";

import JoinRoom from "@/components/room/JoinRoom";
import JoinedRoom from "@/components/room/JoinedRoom";
import { isValidRoomId } from "@/lib/room-id";
import { DataProvider } from "@/provider/DataProvider";
import { SocketProvider } from "@/provider/SocketContext";
import { joined } from "@/state/atom";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Socket, io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import { MediaStreamProvider } from "@/provider/MediaProvider";

const Page = ({ params }: { params: { room: string } }) => {
  const room = params.room;
  const router = useRouter();

  // let socket: Socket
  const [socket, setSocket] = useState<Socket>();

  const [pageLoading, setPageLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const [join, setJoin] = useRecoilState(joined);

  useEffect(() => {
    if (!isValidRoomId(room)) {
      setLoadingMessage("Invalid Room Code");
      setJoin("wrongcode");
    } else {
      // using on testing time
      // setPageLoading(false);
      checkRoom(room);
    }
  }, []);

  const checkRoom = async (roomId: string) => {
    try {
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
        toast("Room Not exist", {
          hideProgressBar: true,
          type: "info",
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast("Some Error Happened", {
        hideProgressBar: true,
        type: "error",
        position: "bottom-right",
      });
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <SocketProvider>
      <MediaStreamProvider>
        <DataProvider>
          <ToastContainer />
          <Head>
            <title>Meet - {room}</title>
          </Head>
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
              <section className="w-screen h-screen flex flex-col items-center justify-center text-xl">
                <div className="text-3xl font-medium -mt-[15%]">{`You've left the meeting`}</div>

                <div className="rest mt-7 p-4 rounded-sm border-[1.3px] border-black/20 flex flex-col gap-3">
                  <div className="flex gap-4 items-center pr-16 text-sm">
                    <div className="left w-10 h-14 rounded-sm border-[1.3px] border-black/20"></div>
                    <div className="texts flex flex-col">
                      <div className="heading font-semibold text-black/60">
                        Your seeting is safe
                      </div>
                      <div className="heading text-xs text-black/60 font-medium ml-0.5">
                        No one can Pin a unless invited or <br /> admitted by
                        the host
                      </div>
                    </div>
                  </div>
                  <div className="learn flex items-center justify-end font-semibold text-sm text-[#1a73e9]">
                    Learn more
                  </div>
                </div>
              </section>
            ) : join == "wrongcode" ? (
              <section className="w-screen h-screen flex flex-col items-center justify-center text-xl">
                <div className="text-3xl -mt-[10%]">
                  Check your meeting code
                </div>

                <div className="heading text-sm font-medium text-center text-black/40 mt-10">
                  Make sure you entered the correct meeting code in the URL for
                  example: <br /> https://meet.gooqle.com/
                  <span className="font-semibold text-black">
                    xxx-yyyy-zzz
                  </span>{" "}
                  <span className="text-[#1a73e9]">Learn more</span>
                </div>

                <button className="outline-none border-none bg-[#1a73e9] rounded-sm px-4 py-1.5 mt-5 text-sm text-white ">
                  Return to home screen
                </button>
                <button className="outline-none border-none text-[#1a73e9] rounded-md mt-5 text-sm">
                  Submit feedback
                </button>

                <div className="rest mt-7 p-4 rounded-sm border-[1.3px] border-black/20 flex flex-col gap-3">
                  <div className="flex gap-4 items-center pr-16 text-sm">
                    <div className="left w-10 h-14 rounded-sm border-[1.3px] border-black/20"></div>
                    <div className="texts flex flex-col">
                      <div className="heading font-semibold text-black/60">
                        Your seeting is safe
                      </div>
                      <div className="heading text-xs text-black/60 font-medium ml-0.5">
                        No one can Pin a unless invited or <br /> admitted by
                        the host
                      </div>
                    </div>
                  </div>
                  <div className="learn flex items-center justify-end font-semibold text-sm text-[#1a73e9]">
                    Learn more
                  </div>
                </div>
              </section>
            ) : (
              <section className="w-screen h-screen flex flex-col items-center justify-center text-xl">
                Back Nothing Here
                <button
                  className="my-2 px-3 py-1.5 rounded-md border-none outline-none bg-[#0b57cf]"
                  onClick={(e) => router.replace("/")}
                >
                  Return
                </button>
              </section>
            )}
          </AnimatePresence>
        </DataProvider>
      </MediaStreamProvider>
    </SocketProvider>
  );
};

export default Page;
