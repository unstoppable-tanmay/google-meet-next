/* eslint-disable @next/next/no-img-element */
import { useMediaStream } from "@/provider/MediaProvider";
import { useSocket } from "@/provider/SocketContext";
import { settings, tracksAtom } from "@/state/atom";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";
import { PeerDetailsType, UserSocketType } from "@/types/types";
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

  return (
    <motion.section
      layout
      className="flex-1 h-full p-1 rounded-lg flex items-center justify-center"
    >
      <div className="video-section overflow-hidden w-full h-full flex items-center justify-center gap-6">
        <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[300px] aspect-square overflow-hidden">
          <video
            autoPlay
            className="w-full h-full object-cover"
            style={{ display: setting.cameraState ? "block" : "none" }}
            ref={myVideoElement}
          ></video>
          {!setting.cameraState && (
            <div className="userImage w-[clamp(40px,60px,80px)] aspect-square rounded-full bg-white/20">
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
        {meetDetails?.peers.map((user, index) => {
          return user.socketId != socket?.id ? (
            <Screen key={user.socketId} user={user} />
          ) : (
            <></>
          );
        })}
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
    <>
      <div className="rounded-xl bg-[#3c4043] flex items-center justify-center w-[300px] aspect-square overflow-hidden">
        <video
          autoPlay
          className="w-full h-full object-cover"
          style={{ display: user.video ? "block" : "none" }}
          ref={videoElement}
        ></video>
        <audio ref={audioElement} autoPlay className="hidden"></audio>
        {!user.video && (
          <div className="userImage w-[clamp(40px,60px,80px)] flex items-center justify-center text-white aspect-square rounded-full bg-white/20">
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
  );
};
const Screen = ({ user }: { user: PeerDetailsType }) => {
  const [tracks, setTracks] = useRecoilState(tracksAtom);
  const screenElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (tracks.find((e) => e.socketId == user.socketId && e.type == "screen")) {
      screenElement.current!.srcObject = new MediaStream([
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
            <div className="userImage w-[clamp(40px,60px,80px)] flex items-center justify-center text-white aspect-square rounded-full bg-white/20">
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
