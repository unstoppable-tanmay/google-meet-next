/* eslint-disable @next/next/no-img-element */
import Sound from "@/components/common/Sound";
import { useMediaStream } from "@/provider/MediaProvider";
import { useSocket } from "@/provider/SocketContext";
import { settings, tracksAtom } from "@/state/atom";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";
import { PeerDetailsType } from "@/types/types";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

const VideoArea = () => {
  const { socket } = useSocket();
  const session = useSession();
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);
  const [setting, setSettings] = useRecoilState(settings);
  const {
    videoStream,
    audioStream,
    screenStream,
    getVideoStream,
    getAudioStream,
    stopVideoStream,
    stopAudioStream,
  } = useMediaStream();

  const myVideoElement = useRef<HTMLVideoElement>(null);
  const myScreenElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(meetDetails);
  }, [meetDetails]);

  useEffect(() => {
    if (videoStream && myVideoElement.current)
      myVideoElement.current.srcObject = new MediaStream(videoStream);
  }, [videoStream, setting.cameraState]);

  useEffect(() => {
    if (screenStream && myScreenElement.current)
      myScreenElement.current.srcObject = new MediaStream(screenStream);
  }, [screenStream, setting.screenState]);

  return (
    <motion.section
      layout
      className="flex-1 h-full p-1 rounded-lg flex items-center justify-center "
    >
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center flex-wrap gap-6">
        {/* You */}
        <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[clamp(100px,300px,400px)] h-[clamp(70px,210px,280px)] overflow-hidden relative group">
          <div className="overlay z-30 w-full h-full absolute p-3 flex flex-col justify-end">
            <div className="name font-medium text-white/60 text-sm self-start">
              {session.data?.user?.name?.split(" ").slice(0, 2).join(" ")}(You)
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 rounded-full bg-black/25 px-4 py-3 absolute duration-250 z-40 flex gap-2.5 items-center justify-center">
            <div className="pin w-6 aspect-square cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
              </svg>
            </div>
            <div className="effect w-6 aspect-square cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="m160-840 80 160h120l-80-160h80l80 160h120l-80-160h80l80 160h120l-80-160h120q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840Zm0 240v400h640v-400H160Zm0 0v400-400Zm160 360h320v-22q0-44-44-71t-116-27q-72 0-116 27t-44 71v22Zm160-160q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Z" />
              </svg>
            </div>
            <div className="menu w-6 aspect-square cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
            </div>
          </div>

          <div className="sound absolute top-3 right-3 z-30">
            {/* <Sound stream={audioStream ?? undefined} /> */}
          </div>
          <video
            autoPlay
            className="w-full h-full object-cover z-20"
            style={{ display: setting.cameraState ? "block" : "none" }}
            ref={myVideoElement}
          ></video>
          {!setting.cameraState && (
            <div className="userImage w-[clamp(30px,80px,150px)] aspect-square rounded-full bg-white/20 z-10">
              {session.data?.user?.image ? (
                <img
                  src={session.data?.user?.image}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                session.data?.user?.name && session.data?.user?.name[0]
              )}
            </div>
          )}
        </div>

        {/* Your Screen */}
        {setting.screenState && screenStream && (
          <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[clamp(100px,300px,400px)] h-[clamp(70px,210px,280px)] overflow-hidden relative">
            <div className="overlay z-30 w-full h-full absolute p-3 flex flex-col justify-end">
              <div className="name font-medium text-white/60 text-sm self-start">
                {session.data?.user?.name?.split(" ").slice(0, 2).join(" ")}
              </div>
            </div>
            <video
              autoPlay
              className="w-full h-full object-cover"
              style={{ display: setting.screenState ? "block" : "none" }}
              ref={myScreenElement}
            ></video>
          </div>
        )}

        {/* Other Screen */}
        {meetDetails?.peers.map((user, index) => {
          return user.socketId != socket?.id ? (
            <Screen key={user.socketId} user={user} />
          ) : (
            <></>
          );
        })}

        {/* Other Users */}
        {meetDetails?.peers.map((user, index) => {
          return user.socketId != socket?.id ? (
            <User key={user.socketId} user={user} />
          ) : (
            <></>
          );
        })}
      </div>
    </motion.section>
  );
};

export default VideoArea;

const User = ({ user }: { user: PeerDetailsType }) => {
  const [tracks, setTracks] = useRecoilState(tracksAtom);
  const videoElement = useRef<HTMLVideoElement>(null);
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (tracks.find((e) => e.socketId == user.socketId && e.type == "video")) {
      videoElement.current!.srcObject = new MediaStream([
        tracks.find(
          (track) => track.socketId == user.socketId && track.type == "video"
        )?.tracks!,
      ]);
    }
  }, [tracks, user]);

  useEffect(() => {
    if (tracks.find((e) => e.socketId == user.socketId && e.type == "audio")) {
      audioElement.current!.srcObject = new MediaStream([
        tracks.find(
          (track) => track.socketId == user.socketId && track.type == "audio"
        )?.tracks!,
      ]);
    }
  }, [tracks, user]);

  return (
    <div
      className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[clamp(100px,300px,400px)] h-[clamp(70px,210px,280px)] overflow-hidden relative group"
      id={user.socketId}
    >
      <div className="overlay z-30 w-full h-full absolute p-3 flex flex-col justify-end">
        <div className="name font-medium text-white/60 text-sm self-start">
          {user?.name?.split(" ").slice(0, 2).join(" ")}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 rounded-full bg-black/25 px-4 py-3 absolute duration-250 z-40 flex gap-2.5 items-center justify-center">
        <div className="pin w-6 aspect-square cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
          </svg>
        </div>
        <div className="effect w-6 aspect-square cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="m160-840 80 160h120l-80-160h80l80 160h120l-80-160h80l80 160h120l-80-160h120q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840Zm0 240v400h640v-400H160Zm0 0v400-400Zm160 360h320v-22q0-44-44-71t-116-27q-72 0-116 27t-44 71v22Zm160-160q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Z" />
          </svg>
        </div>
        <div className="menu w-6 aspect-square cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
          </svg>
        </div>
      </div>

      <div className="sound absolute top-3 right-3 z-30">
        {/* <Sound
          stream={
            tracks.find((e) => e.socketId == user.socketId && e.type == "audio")
              ? new MediaStream([
                  tracks.find(
                    (track) =>
                      track.socketId == user.socketId && track.type == "audio"
                  )?.tracks!,
                ])
              : undefined
          }
        /> */}
      </div>
      <video
        autoPlay
        className="w-full h-full object-cover"
        style={{ display: user.video ? "block" : "none" }}
        ref={videoElement}
      ></video>
      <audio ref={audioElement} autoPlay className="hidden"></audio>
      {!user.video && (
        <div className="userImage w-[clamp(30px,80px,150px)] flex items-1enter justify-center text-white/60 aspect-square rounded-full bg-white/20">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            user.name[0]
          )}
        </div>
      )}
    </div>
  );
};

const Screen = ({ user }: { user: PeerDetailsType }) => {
  const [tracks, setTracks] = useRecoilState(tracksAtom);
  const screenElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (
      user.screen &&
      screenElement.current &&
      tracks.find((e) => e.socketId == user.socketId && e.type == "screen")
    ) {
      screenElement.current.srcObject = new MediaStream([
        tracks.find(
          (track) => track.socketId == user.socketId && track.type == "screen"
        )?.tracks!,
      ]);
    }
  }, [tracks, user]);

  return (
    user.screen && (
      <>
        <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[clamp(100px,300px,400px)] h-[clamp(70px,210px,280px)] overflow-hidden">
          <video
            autoPlay
            className="w-full h-full object-cover"
            style={{ display: user.video ? "block" : "none" }}
            ref={screenElement}
          ></video>
          {!user.screen && (
            <div className="userImage w-[clamp(30px,80px,150px)] flex items-1enter justify-center text-white/60 aspect-square rounded-full bg-white/20">
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                user.name[0]
              )}
            </div>
          )}
        </div>
      </>
    )
  );
};
