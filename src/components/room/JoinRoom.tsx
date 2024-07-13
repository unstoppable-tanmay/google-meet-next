/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";

import Sound from "../common/Sound";
import Button from "../common/Button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Avatar,
} from "@nextui-org/react";

import { useRecoilState } from "recoil";
import { joined, settings } from "@/state/atom";

import {
  MdOutlineArrowDropDown,
  MdOutlinePhonelink,
  MdOutlinePresentToAll,
} from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { FiMic, FiMicOff } from "react-icons/fi";
import { BiVideo, BiVideoOff } from "react-icons/bi";
import { WiStars } from "react-icons/wi";
import { PiSpeakerHighBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import User from "../common/User";
import axios from "axios";
import { MeetType, PeerDetailsType } from "@/types/types";
import { toast } from "react-toastify";
import { useSocket } from "@/provider/SocketContext";
import { useMediaStream } from "@/provider/MediaProvider";

const JoinRoom = ({ roomId }: { roomId: string }) => {
  const { socket } = useSocket();
  const {
    videoStream,
    audioStream,
    getVideoStream,
    getAudioStream,
    stopVideoStream,
    stopAudioStream,
    cameras,
    speakers,
    microphones,
  } = useMediaStream();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomStateLoading, setRoomStateLoading] = useState(true);

  const [setting, setSettings] = useRecoilState(settings);
  const [join, setJoin] = useRecoilState(joined);

  const [room, setRoom] = useState<MeetType | null>(null);

  const session = useSession();
  const router = useRouter();

  // Add Camera
  useEffect(() => {
    const videoElement = videoRef.current;

    const addVideo = async () => {
      if (videoRef === null || setting.camera?.deviceId === undefined) return;

      if (!open || !setting.cameraState) {
        if (videoElement && videoElement.srcObject) {
          stopVideoStream(setting.camera.deviceId);
        }
        return;
      }

      try {
        const stream = await getVideoStream(setting.camera.deviceId);
        videoElement!.srcObject = stream;
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };
    addVideo();

    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setting.cameraState, setting.camera, getVideoStream, stopVideoStream]);

  useEffect(() => {
    getMeetingState();
  }, []);

  const getMeetingState = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/getMeetDetails`,
        {
          params: {
            roomId: roomId,
          },
        }
      );

      if (res.status == 200) {
        setRoom(res.data.data);
        setRoomStateLoading(false);
      } else {
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
    }
  };

  const joinNow = () => {
    setJoin("joined");
  };
  const present = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };
  const askToJoin = () => {
    setRoomStateLoading(true);
    socket?.emit(
      "ask-join",
      {
        user: session.data?.user as PeerDetailsType,
        roomName: roomId,
      },
      (data: boolean | null) => {
        console.log(data);
        data == null
          ? toast("You are denied", {
              hideProgressBar: true,
              type: "error",
              position: "bottom-right",
            })
          : data == true
          ? setJoin("joined")
          : toast("You are denied", {
              hideProgressBar: true,
              type: "error",
              position: "bottom-right",
            });
      }
    );
    setRoomStateLoading(false);
  };
  const askToPresent = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };
  const switchHere = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };
  const joinHereAlso = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };
  const companionMode = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };

  return (
    <motion.section
      exit={{ transition: { duration: 1 } }}
      className="w-full min-h-screen flex flex-col gap-6 items-center"
    >
      <nav className="flex justify-between px-4 items-center w-full py-3">
        <div className="logo flex items-center gap-1 flex-shrink-0">
          <img src="/logo.svg" alt="" className="logo max-h-8 md:max-h-10" />
        </div>
        {session.status == "authenticated" ? (
          <div className="account flex gap-2 items-center">
            <div className="text flex-col text-black/70 text-sm hidden md:flex items-end gap-1">
              <div className="email">{session.data?.user?.email}</div>
              <button
                onClick={(e) => signIn("google")}
                className="switchacc text-blue-300 duration-100 hover:text-blue-500 text-xs cursor-pointer font-semibold"
              >
                Switch Account
              </button>
            </div>
            <User user={session.data.user} />
          </div>
        ) : session.status == "loading" ? (
          <>...</>
        ) : (
          <button
            onClick={(e) => signIn("google")}
            className="switchacc text-blue-300 duration-100 hover:text-blue-500 text-xs cursor-pointer font-semibold"
          >
            Sign In
          </button>
        )}
      </nav>
      <div className="content flex-1 flex items-center justify-center xl:justify-between flex-col xl:flex-row gap-10 xl:gap-6 xl:w-[80%] xl:-mt-20">
        <div className="videoWraper w-[clamp(150px,750px,90vw)]">
          <div className="video w-full rounded-lg overflow-hidden aspect-[6/3.3] bg-black relative">
            {setting.cameraState ? (
              <video
                className="video w-full h-full object-cover z-[1000] scale-x-[-1] mask-vertical-sm"
                ref={videoRef}
                autoPlay
                playsInline
                width={"100%"}
              ></video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-medium z-[1000]  text-white">
                No Video
              </div>
            )}
            <div className="overlay absolute top-0 left-0 w-full h-full flex flex-col justify-between">
              <div className="top flex w-full items-center justify-between px-4 py-4">
                <div className="name text-white font-medium text-sm">
                  {session.data?.user?.name?.split(" ").slice(0, 2).join(" ")}
                </div>
                <div className="menu">
                  <HiDotsVertical className="text-white text-xl" />
                </div>
              </div>
              <div className="bottom flex w-full items-end justify-between px-4 py-4 text-white">
                {setting.microphoneState ? (
                  <Sound />
                ) : (
                  <div className="w-7"></div>
                )}
                <div className="button flex gap-6 text-xl md:text-2xl">
                  <Button
                    on={setting.microphoneState}
                    onClick={(e) => {
                      console.log(setting.microphoneState);
                      setSettings((prev) => ({
                        ...prev,
                        microphoneState: !setting.microphoneState,
                      }));
                    }}
                  >
                    {setting.microphoneState ? <FiMic /> : <FiMicOff />}
                  </Button>
                  <Button
                    on={setting.cameraState}
                    onClick={(e) => {
                      console.log(setting.cameraState);
                      setSettings((prev) => ({
                        ...prev,
                        cameraState: !setting.cameraState,
                      }));
                    }}
                  >
                    {setting.cameraState ? <BiVideo /> : <BiVideoOff />}
                  </Button>
                </div>
                <Button on>
                  <WiStars className="text-2xl" />
                </Button>
              </div>
            </div>
          </div>
          <div className="options flex gap-3 py-2 px-2 text-black/60 text-lg pt-4 flex-wrap justify-center md:justify-start font-semibold">
            <Popover placement="top-start">
              <PopoverTrigger>
                <div className="item w-[clamp(50px,150px,200px)] flex items-center gap-2 rounded-full border-[1.5px] border-transparent hover:border-black/10 duration-200 hover:bg-[#f6fafe] px-3 py-2 cursor-pointer relative">
                  <FiMic />
                  <span className="flex-1 text-ellipsis overflow-hidden line-clamp-1 text-sm">
                    {setting.microphone?.label ?? "Select"}
                  </span>
                  <MdOutlineArrowDropDown />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[clamp(100px,500px,90vw)] shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
                {microphones.map((e, i) => {
                  return (
                    <div
                      className="w-full py-2 px-3 hover:bg-black/10 cursor-pointer"
                      key={i}
                      onClick={(k) =>
                        setSettings({ ...setting, microphone: e.value })
                      }
                    >
                      {e.label}
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
            <Popover placement="top-start">
              <PopoverTrigger>
                <div className="item w-[clamp(50px,150px,200px)] flex items-center gap-2 rounded-full border-[1.5px] border-transparent hover:border-black/10 duration-200 hover:bg-[#f6fafe] px-3 py-2 cursor-pointer relative">
                  <PiSpeakerHighBold />
                  <span className="flex-1 text-ellipsis overflow-hidden line-clamp-1 text-sm">
                    {setting.speaker?.label ?? "Select"}
                  </span>
                  <MdOutlineArrowDropDown />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[clamp(100px,500px,90vw)] shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0 py-0">
                {speakers.map((e, i) => {
                  return (
                    <div
                      className="w-full py-2 px-3 hover:bg-black/10 cursor-pointer"
                      key={i}
                      onClick={(k) =>
                        setSettings({ ...setting, speaker: e.value })
                      }
                    >
                      {e.label}
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
            <Popover placement="top-start">
              <PopoverTrigger>
                <div className="item w-[clamp(50px,150px,200px)] flex items-center gap-2 rounded-full border-[1.5px] border-transparent hover:border-black/10 duration-200 hover:bg-[#f6fafe] px-3 py-2 cursor-pointer relative">
                  <BiVideo />
                  <span className="flex-1 text-ellipsis overflow-hidden line-clamp-1 text-sm">
                    {setting.camera?.label ?? "Select"}
                  </span>
                  <MdOutlineArrowDropDown />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[clamp(100px,500px,90vw)] shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0 py-0">
                {cameras.map((e, i) => {
                  return (
                    <div
                      className="w-full py-2 px-3 hover:bg-black/10 cursor-pointer"
                      key={i}
                      onClick={(k) =>
                        setSettings({ ...setting, camera: e.value })
                      }
                    >
                      {e.label}
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {roomStateLoading ? (
          <div className="flex items-center justify-center xl:pr-28">
            <Spinner />
          </div>
        ) : (
          <div className="joining flex flex-col items-center justify-center xl:pr-28">
            <div className="heading text-2xl mb-6">Ready to join?</div>
            <div className="available text-sm font-semibold text-black/60 mb-2 flex gap-1">
              {room?.peers?.length &&
                room.peers?.slice(3).map((e) => {
                  return (
                    <>
                      <Avatar src={e.image} size="sm" />
                    </>
                  );
                })}
              {room?.peers?.length && room?.peers?.length > 3 && (
                <Avatar>+</Avatar>
              )}
            </div>
            <div className="available text-xs font-semibold text-black/60 mb-4">
              {room?.peers?.length ? (
                <>
                  {room.peers?.slice(3).map((e) => {
                    return <>{e.name.split(" ")[0]}</>;
                  })}
                  {room?.peers?.length && room?.peers?.length > 3
                    ? " and more are "
                    : " is "}
                  here
                </>
              ) : (
                "No one else is here"
              )}
            </div>
            <div className="buttons flex gap-2 items-center text-sm font-medium mb-10">
              {room?.admin.email === session.data?.user?.email ? (
                <>
                  {room?.peers.find(
                    (e) => e.email == session.data?.user?.email
                  ) ? (
                    <>
                      <div
                        className="joinnow cursor-pointer px-6 py-3.5 rounded-full duration-200 bg-blue-500 text-white shadow-lg hover:bg-blue-600"
                        onClick={switchHere}
                      >
                        Switch Here
                      </div>
                      <div
                        className="joinnow cursor-pointer px-6 py-3 rounded-full flex gap-2 items-center bg-gray-50 border-[.7px] border-black/10 text-blue-500 shadow-md duration-200 hover:bg-[#dfebf6]"
                        onClick={present}
                      >
                        <MdOutlinePresentToAll className="text-2xl" />
                        Present
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="joinnow cursor-pointer px-6 py-3.5 rounded-full duration-200 bg-blue-500 text-white shadow-lg hover:bg-blue-600"
                        onClick={joinNow}
                      >
                        Join now
                      </div>
                      <div
                        className="joinnow cursor-pointer px-6 py-3 rounded-full flex gap-2 items-center bg-gray-50 border-[.7px] border-black/10 text-blue-500 shadow-md duration-200 hover:bg-[#dfebf6]"
                        onClick={present}
                      >
                        <MdOutlinePresentToAll className="text-2xl" />
                        Present
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div
                    className="joinnow cursor-pointer px-6 py-3.5 rounded-full duration-200 bg-blue-500 text-white shadow-lg hover:bg-blue-600"
                    onClick={askToJoin}
                  >
                    Ask To Join
                  </div>
                  <div
                    className="joinnow cursor-pointer px-6 py-3 rounded-full flex gap-2 items-center bg-gray-50 border-[.7px] border-black/10 text-blue-500 shadow-md duration-200 hover:bg-[#dfebf6]"
                    onClick={askToPresent}
                  >
                    <MdOutlinePresentToAll className="text-2xl" />
                    Present
                  </div>
                </>
              )}
            </div>
            <div className="desc text-sm font-semibold text-black/60 mb-5">
              Other joining options
            </div>
            {room?.admin.email === session.data?.user?.email &&
              room?.peers.find((e) => e.email == session.data?.user?.email) && (
                <div
                  className="joiningOpt cursor-pointer text-blue-500 text-sm flex items-center gap-2 pb-3"
                  onClick={joinHereAlso}
                >
                  <MdOutlinePhonelink className="text-2xl" />
                  Join Here Also
                </div>
              )}
            <div
              className="joiningOpt cursor-pointer text-blue-500 text-sm flex items-center gap-2"
              onClick={companionMode}
            >
              <MdOutlinePhonelink className="text-2xl" />
              Use Companion Mode
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default JoinRoom;
