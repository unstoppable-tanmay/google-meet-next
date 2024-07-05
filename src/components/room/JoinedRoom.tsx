import React, { useEffect, useRef, useState } from "react";

import { Socket, io } from "socket.io-client";

import { useRecoilState } from "recoil";
import { joined, settings, socketAtom, tracksAtom } from "@/state/atom";

import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@nextui-org/react";

import BottomBar from "./components/BottomBar";
import VideoArea from "./components/VideoArea";

import { joinRoom, sendVideo } from "@/lib/helper";

import { BiSolidBuildings } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useSocket } from "@/provider/SocketContext";

const JoinedRoom = ({ roomId }: { roomId: string }) => {
  const session = useSession();
  // const [socket, setSocket] = useRecoilState(socketAtom);

  // whole session join
  const [join, setJoin] = useRecoilState(joined);
  const videoContainer = useRef<HTMLVideoElement>(null);

  const [tracks, setTracks] = useRecoilState(tracksAtom);

  // initial loading
  const [loading, setLoading] = useState(true);

  const [setting, setSettings] = useRecoilState(settings);

  const { socket } = useSocket();

  // Joining Logic
  useEffect(() => {
    // const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/mediasoup`, {
    //   transports: ["websocket"],
    // });

    // const socket = socketInitializer();
    if (socket) {
      socket.emit("start-meet");
      socket?.on("connection-success", ({ socketId }) => {
        console.log("joining");
        joinRoom(
          socket,
          roomId,
          setTracks,
          {
            email: session.data?.user?.email!,
            isAdmin: false,
            name: session.data?.user?.name!,
            image: session.data?.user?.image || "",
          },
          setLoading
        );
      });
    }
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  // useEffect(() => {
  //   if (videoContainer.current) {
  //     videoContainer.current.srcObject = new MediaStream([tracks!]);
  //   }
  //   console.log(tracks);
  // }, [tracks]);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key={"aisudhnasb"}
          exit={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1 }}
          className="layer w-screen h-screen bg-black pointer-events-none flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000] absolute gap-3"
        >
          <Spinner size="lg" /> Loading...
        </motion.div>
      ) : (
        <section className="w-full h-screen bg-[#202124] flex flex-col">
          {false && (
            <div className="topbar py-2 px-6 flex">
              <div className="viewers bg-[#f4bc16] p-2 flex items-center justify-center rounded-md">
                <BiSolidBuildings className="text-xl" />
              </div>
            </div>
          )}
          <motion.div
            layout
            className="responsive-area flex-1 p-2 w-full flex gap-2"
          >
            <VideoArea
              users={[
                {
                  name: "Tanmay",
                  socketId: "asdagsdggf",
                  tracks: [],
                },
                {
                  name: "Tanmay",
                  socketId: "fghjym",
                  tracks: [],
                },
                {
                  name: "Tanmay",
                  socketId: "serg",
                  tracks: [],
                },
                {
                  name: "Tanmay",
                  socketId: "ehrt",
                  tracks: [],
                },
                // {
                //   name: "Tanmay",
                //   socketId: "asd",
                //   tracks: [],
                // },
                // {
                //   name: "Tanmay",
                //   socketId: "nrtyg",
                //   tracks: [],
                // },
                // {
                //   name: "Tanmay",
                //   socketId: "zdfb",
                //   tracks: [],
                // },
              ]}
            />
            {/* <video src="" ref={videoContainer} controls></video>
            <button onClick={(e) => sendVideo()} className="bg-white">Send</button> */}
            <motion.div
              initial={{ marginRight: "-358px" }}
              animate={
                setting.cameraState
                  ? { marginRight: "0%" }
                  : { marginRight: "-358px" }
              }
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="rightArea w-[350px] h-full bg-white rounded-lg flex-shrink-0"
            ></motion.div>
          </motion.div>
          <BottomBar />
        </section>
      )}
    </AnimatePresence>
  );
};

export default JoinedRoom;
