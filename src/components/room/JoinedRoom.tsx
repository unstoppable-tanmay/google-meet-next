import React, { useEffect, useRef, useState } from "react";

import { Socket, io } from "socket.io-client";

import { useRecoilState } from "recoil";
import { joined, settings, tracksAtom } from "@/state/atom";

import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@nextui-org/react";

import BottomBar from "./components/BottomBar";
import VideoArea from "./components/VideoArea";

import { connectSendTransport, joinRoom } from "@/lib/helper";

import { BiSolidBuildings } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useSocket } from "@/provider/SocketContext";
import {
  MeetType,
  PeerDetailsType,
  UserSocketType,
  UserType,
} from "@/types/types";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";
import {
  AudioManager,
  ScreenManager,
  VideoManager,
} from "@/lib/transports-manager";

const JoinedRoom = ({ roomId }: { roomId: string }) => {
  const session = useSession();
  const { socket } = useSocket();

  // whole session join
  const [join, setJoin] = useRecoilState(joined);

  const [tracks, setTracks] = useRecoilState(tracksAtom);

  // initial loading
  const [loading, setLoading] = useState(false);

  const [setting, setSettings] = useRecoilState(settings);
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

  const callevent = (event: string, data: any) => {
    console.log(event);
    socket?.emit(event, data);
  };

  // Joining Logic
  useEffect(() => {
    if (socket && session.status === "authenticated") {
      socket.emit("start-meet");
      console.log("joining");
      socket?.on("connection-success", ({ socketId }) => {
        joinRoom(
          socket,
          roomId,
          setTracks,
          {
            email: session.data?.user?.email!,
            name: session.data?.user?.name!,
            image: session.data?.user?.image || "",
            audio: setting.microphoneState,
            video: setting.cameraState,
            screen: setting.screenState,
            hand: false,
            socketId: socket.id,
          },
          setLoading,
          setMeetDetails
        );
      });

      socket.on(
        "asking-join",
        ({ user }: { user: UserType }, callback: (data: boolean) => void) => {
          // TODO to create the asking logic and return the response
          callback(true);
        }
      );

      socket.on(
        "new-join",
        ({
          socketId,
          peerDetails,
          meetDetails,
        }: {
          socketId: string;
          peerDetails: PeerDetailsType;
          meetDetails: MeetType;
        }) => {
          setMeetDetails(meetDetails);
          console.log(socketId, peerDetails, meetDetails);
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket) VideoManager(setting.cameraState, socket);
  }, [setting.cameraState, socket]);

  useEffect(() => {
    if (socket) AudioManager(setting.microphoneState, socket);
  }, [setting.microphoneState, socket]);

  useEffect(() => {
    if (socket) ScreenManager(setting.screenState, socket);
  }, [setting.screenState, socket]);

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
          {meetDetails?.settings.access == "open" && (
            <div className="topbar py-2 px-6 flex">
              <div
                // onClick={(e) =>
                //   callevent("ask-join", {
                //     user: session.data?.user,
                //     roomName: roomId,
                //   })
                // }
                className="viewers bg-[#f4bc16] p-2 flex items-center justify-center rounded-md"
              >
                <BiSolidBuildings className="text-xl" />
              </div>
            </div>
          )}
          <motion.div
            layout
            className="responsive-area flex-1 p-2 w-full flex gap-2"
          >
            <VideoArea />
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
