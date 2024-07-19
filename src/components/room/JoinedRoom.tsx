/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRecoilState } from "recoil";
import { joined, rightBoxAtom, settings, tracksAtom } from "@/state/atom";
import { meetDetailsAtom, messagesAtom } from "@/state/JoinedRoomAtom";

import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@nextui-org/react";

import BottomBar from "./components/BottomBar";
import VideoArea from "./components/VideoArea";
import AskingComp from "../common/AskingComp";

import { BiSolidBuildings } from "react-icons/bi";

import { MeetType, PeerDetailsType, UserType } from "@/types/types";

import { useSession } from "next-auth/react";
import { useSocket } from "@/provider/SocketContext";
import { useData } from "@/provider/DataProvider";
import { useMediaStream } from "@/provider/MediaProvider";

import Info from "./components/RightBoxComponents/Info";
import Users from "./components/RightBoxComponents/Users";
import Activities from "./components/RightBoxComponents/Activities";
import Message from "./components/RightBoxComponents/Message";
import Setting from "./components/RightBoxComponents/Setting";

const JoinedRoom = ({ roomId }: { roomId: string }) => {
  const session = useSession();
  const { socket } = useSocket();
  const {
    producerTransport,
    consumerTransports,
    consumingTransports,
    device,
    joinRoom,
    VideoManager,
    AudioManager,
    ScreenManager,
  } = useData();

  const { stopAudioStream, stopScreenStream, stopVideoStream } =
    useMediaStream();

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
  const [rightBoxElement, setRightBoxElement] = useState<ReactNode | null>(
    null
  );

  const [messages, setMessages] = useRecoilState(messagesAtom);

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
        "message",
        ({
          user,
          roomName,
          message,
        }: {
          user: PeerDetailsType;
          roomName: string;
          message: string;
        }) => {
          setMessages((prev) => [...prev, { message, user: user.name }]);
        }
      );

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

  // handle admit
  const handleAdmit = useCallback(() => {
    if (callback) {
      console.log("called handleAdmit");
      callback(true);
    }
    setIsPopoverOpen(false);
  }, [callback]);

  // handle deny
  const handleDeny = useCallback(() => {
    if (callback) {
      console.log("called handleDeny");
      callback(false);
    }
    setIsPopoverOpen(false);
  }, [callback]);

  // camera update
  useEffect(() => {
    if (socket) {
      VideoManager(setting.cameraState, socket);
      socket?.emit("user-update", {
        socketId: socket.id,
        roomName: roomId,
        data: { video: setting.cameraState } as Partial<PeerDetailsType>,
      });
    }
  }, [setting.cameraState, socket]);

  // microphone update
  useEffect(() => {
    if (socket) {
      AudioManager(setting.microphoneState, socket);
      socket?.emit("user-update", {
        socketId: socket.id,
        roomName: roomId,
        data: { audio: setting.microphoneState } as Partial<PeerDetailsType>,
      });
    }
  }, [setting.microphoneState, socket]);

  // screen update
  useEffect(() => {
    if (socket) {
      ScreenManager(setting.screenState, socket, roomId);
      socket?.emit("user-update", {
        socketId: socket.id,
        roomName: roomId,
        data: { screen: setting.screenState } as Partial<PeerDetailsType>,
      });
    }
  }, [setting.screenState, socket]);

  // CleanUp
  useEffect(() => {
    return () => {
      stopAudioStream();
      stopVideoStream();
      stopScreenStream();

      producerTransport.current?.close();
      consumerTransports.current.map((e) => e.consumer.close());
      consumerTransports.current = [];
      consumingTransports.current = [];
      producerTransport.current = null;
      device.current = null;

      setMeetDetails(null);
      setUserToAdmit(null);

      socket?.close();
    };
  }, []);

  // rightbox element and open logic
  useEffect(() => {
    if (
      setting.info ||
      setting.users ||
      setting.activities ||
      setting.message ||
      setting.setting
    ) {
      setRightBoxAtom(true);
    } else {
      setRightBoxAtom(false);
    }

    if (setting.info) {
      setRightBoxElement(<Info />);
    } else if (setting.users) {
      setRightBoxElement(<Users />);
    } else if (setting.activities) {
      setRightBoxElement(<Activities />);
    } else if (setting.message) {
      setRightBoxElement(<Message room={roomId} />);
    } else if (setting.setting) {
      setRightBoxElement(<Setting />);
    }
  }, [
    setting.info,
    setting.users,
    setting.activities,
    setting.message,
    setting.setting,
  ]);

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
        <section className="w-full h-screen bg-[#202124] flex flex-col overflow-hidden">
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
            className="responsive-area flex-1 p-2 w-full flex gap-2 overflow-hidden"
          >
            <VideoArea />
            <motion.div
              initial={{ marginRight: "-358px" }}
              animate={
                rightBox ? { marginRight: "0%" } : { marginRight: "-358px" }
              }
              transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
              className="rightArea w-[350px] h-full bg-white rounded-lg flex-shrink-0 overflow-y-scroll no-scrollbar"
            >
              {rightBoxElement}
            </motion.div>
          </motion.div>
          <motion.div
            animate={
              setting.emojies
                ? { height: "50px", opacity: 1 }
                : { height: "0px", opacity: 0 }
            }
            className="emojies flex items-center justify-center my-1 z-10"
          >
            <div className="emojies rounded-full bg-[#3c4043] px-4 py-2 text-xl tracking-[5px]">
              💖😀🤧🤒
            </div>
          </motion.div>
          <BottomBar />
        </section>
      )}
    </AnimatePresence>
  );
};

export default JoinedRoom;
