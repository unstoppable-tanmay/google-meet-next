/* eslint-disable @next/next/no-img-element */
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
      className="flex-1 h-full p-1 rounded-lg flex items-center justify-center"
    >
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center gap-6">
        {/* You */}
        <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[300px] aspect-square overflow-hidden relative">
          <div className="overlay z-30 w-full h-full absolute p-3 flex flex-col justify-end">
            <div className="name font-medium text-white/60 text-sm self-start">
              {session.data?.user?.name?.split(" ").slice(0, 2).join(" ")}(You)
            </div>
          </div>
          <video
            autoPlay
            className="w-full h-full object-cover z-20"
            style={{ display: setting.cameraState ? "block" : "none" }}
            ref={myVideoElement}
          ></video>
          {!setting.cameraState && (
            <div className="userImage w-[clamp(40px,60px,80px)] aspect-square rounded-full bg-white/20 z-10">
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
          <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[300px] aspect-square overflow-hidden relative">
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
      className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[300px] aspect-square overflow-hidden relative"
      id={user.socketId}
    >
      <div className="overlay z-30 w-full h-full absolute p-3 flex flex-col justify-end">
        <div className="name font-medium text-white/60 text-sm self-start">
          {user?.name?.split(" ").slice(0, 2).join(" ")}
        </div>
      </div>
      <video
        autoPlay
        className="w-full h-full object-cover"
        style={{ display: user.video ? "block" : "none" }}
        ref={videoElement}
      ></video>
      <audio ref={audioElement} autoPlay className="hidden"></audio>
      {!user.video && (
        <div className="userImage w-[clamp(40px,60px,80px)] flex items-1enter justify-center text-white/60 aspect-square rounded-full bg-white/20">
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
        <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[300px] aspect-square overflow-hidden">
          <video
            autoPlay
            className="w-full h-full object-cover"
            style={{ display: user.video ? "block" : "none" }}
            ref={screenElement}
          ></video>
          {!user.screen && (
            <div className="userImage w-[clamp(40px,60px,80px)] flex items-1enter justify-center text-white/60 aspect-square rounded-full bg-white/20">
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
