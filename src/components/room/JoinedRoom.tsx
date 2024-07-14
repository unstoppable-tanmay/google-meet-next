/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRecoilState } from "recoil";
import { joined, rightBoxAtom, settings, tracksAtom } from "@/state/atom";

import { AnimatePresence, motion } from "framer-motion";
import { Spinner, useDisclosure } from "@nextui-org/react";

import BottomBar from "./components/BottomBar";
import VideoArea from "./components/VideoArea";

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
import { useData } from "@/provider/DataProvider";
import AskingComp from "../common/AskingComp";
import { useMediaStream } from "@/provider/MediaProvider";

const JoinedRoom = ({ roomId }: { roomId: string }) => {
  const session = useSession();
  const { socket } = useSocket();
  const {
    joinRoom,
    connectSendTransport,
    VideoManager,
    AudioManager,
    ScreenManager,
  } = useData();

  const {
    cameras,
    microphones,
    screens,
    speakers,
    getAudioStream,
    getScreenStream,
    getVideoStream,
    audioStream,
    screenStream,
    videoStream,
    stopAudioStream,
    stopScreenStream,
    stopVideoStream,
  } = useMediaStream();

  // whole session join
  const [join, setJoin] = useRecoilState(joined);
  const [rightBox, setRightBoxAtom] = useRecoilState(rightBoxAtom);

  const [tracks, setTracks] = useRecoilState(tracksAtom);

  // asking login data
  const [userToAdmit, setUserToAdmit] = useState<UserType | null>(null);
  const [callback, setCallback] = useState<((data: boolean) => void) | null>(
    null
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // initial loading
  const [loading, setLoading] = useState(false);

  const [setting, setSettings] = useRecoilState(settings);
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

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
        async (
          { user }: { user: UserType },
          callback: (data: boolean) => void
        ) => {
          setUserToAdmit(user);
          setCallback(() => callback);
          setIsPopoverOpen(true);

          console.log("opened popup");

          const timer = setTimeout(() => {
            console.log("timer ended");
            callback(false);
            setIsPopoverOpen(false);
          }, 30000);

          return () => clearTimeout(timer);
        }
      );

      // Room Settings Update
      socket.on("meet-update", ({ meet }: { meet: MeetType }) => {
        setMeetDetails(meet);
      });

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
  }, []);

  const handleAdmit = useCallback(() => {
    if (callback) {
      console.log("called handleAdmit");
      callback(true);
    }
    setIsPopoverOpen(false);
  }, [callback]);

  const handleDeny = useCallback(() => {
    if (callback) {
      console.log("called handleDeny");
      callback(false);
    }
    setIsPopoverOpen(false);
  }, [callback]);

  useEffect(() => {
    if (socket) {
      VideoManager(setting.cameraState, socket, connectSendTransport);
      socket?.emit("user-update", {
        socketId: socket.id,
        roomName: roomId,
        data: { video: setting.cameraState } as Partial<PeerDetailsType>,
      });
    }
  }, [setting.cameraState, socket]);

  useEffect(() => {
    if (socket) {
      AudioManager(setting.microphoneState, socket, connectSendTransport);
      socket?.emit("user-update", {
        socketId: socket.id,
        roomName: roomId,
        data: { audio: setting.microphoneState } as Partial<PeerDetailsType>,
      });
    }
  }, [setting.microphoneState, socket]);

  useEffect(() => {
    if (socket) {
      ScreenManager(setting.screenState, socket, connectSendTransport);
      socket?.emit("user-update", {
        socketId: socket.id,
        roomName: roomId,
        data: { screen: setting.screenState } as Partial<PeerDetailsType>,
      });
    }
  }, [setting.screenState, socket]);

  useEffect(() => {
    return () => {
      stopAudioStream();
      stopVideoStream();
      stopScreenStream();
    };
  }, []);

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
          {isPopoverOpen && userToAdmit && (
            <AskingComp user={null} onAdmit={handleAdmit} onDeny={handleDeny} />
          )}
          {meetDetails?.settings?.access == "open" && (
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
            <VideoArea />
            <motion.div
              initial={{ marginRight: "-358px" }}
              animate={
                rightBox ? { marginRight: "0%" } : { marginRight: "-358px" }
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
