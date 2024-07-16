import Button from "@/components/common/Button";
import React, { useState } from "react";

import { FiMic, FiMicOff, FiUsers } from "react-icons/fi";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiVideo,
  BiVideoOff,
} from "react-icons/bi";
import { useRecoilState } from "recoil";
import { joined, settings } from "@/state/atom";
import { FaPhone, FaRegClosedCaptioning } from "react-icons/fa6";
import SmallButtons from "@/components/common/SmallButtons";
import {
  MdInfoOutline,
  MdOutlineEmojiEmotions,
  MdOutlineLockPerson,
  MdMessage,
  MdOutlineMessage,
  MdInfo,
  MdLockPerson,
} from "react-icons/md";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { FaRegHandPaper } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiShapesFill, RiShapesLine } from "react-icons/ri";
import { HiOutlineUsers, HiUsers } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";

const BottomBar = () => {
  const [setting, setSettings] = useRecoilState(settings);
  const [raiseHand, setRaiseHand] = useState(false);
  const [join, setJoin] = useRecoilState(joined);
  const session = useSession();
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);
  return (
    <div className="wrapper flex flex-col">
      <div className="emojies"></div>
      <nav className="w-full flex items-center justify-between px-6 pb-5 text-white/80">
        <div className="meetname font-semibold tracking-wide flex-grow basis-1 text-ellipsis line-clamp-1">
          abc-defg-hij
        </div>
        <div className="middlebuttons flex gap-2 text-xl">
          <SmallButtons
            on={setting.microphoneState}
            onClick={(e) => {
              setSettings((prev) => ({
                ...prev,
                microphoneState: !setting.microphoneState,
              }));
            }}
            open
          >
            {setting.microphoneState ? <BiMicrophone /> : <BiMicrophoneOff />}
          </SmallButtons>
          <SmallButtons
            on={setting.cameraState}
            onClick={(e) => {
              setSettings((prev) => ({
                ...prev,
                cameraState: !setting.cameraState,
              }));
            }}
            open
          >
            {setting.cameraState ? <BiVideo /> : <BiVideoOff />}
          </SmallButtons>
          <SmallButtons
            on={setting.caption}
            onColor="#87b3f8"
            onClick={(e) => {
              setSettings((prev) => ({
                ...prev,
                caption: !setting.caption,
              }));
            }}
          >
            <FaRegClosedCaptioning />
          </SmallButtons>
          <SmallButtons
            on={setting.emojies}
            onColor="#87b3f8"
            onClick={(e) => {
              setSettings((prev) => ({
                ...prev,
                emojies: !setting.emojies,
              }));
            }}
          >
            <MdOutlineEmojiEmotions />
          </SmallButtons>
          <SmallButtons
            on={setting.screenState}
            onColor="#87b3f8"
            onClick={(e) => {
              setSettings((prev) => ({
                ...prev,
                screenState: !setting.screenState,
              }));
            }}
          >
            <LuScreenShare />
            {/* <LuScreenShareOff/> */}
          </SmallButtons>
          <SmallButtons
            on={raiseHand}
            onClick={(e) => setRaiseHand(!raiseHand)}
            onColor="#87b3f8"
          >
            <FaRegHandPaper />
          </SmallButtons>
          <SmallButtons on={false} onColor="#87b3f8">
            <BsThreeDotsVertical />
          </SmallButtons>
          <SmallButtons
            on
            onClick={(e) => {
              setJoin("leaved");
            }}
          >
            <FaPhone className="rotate-[135deg] mx-2.5" />
          </SmallButtons>
        </div>
        <div className="lastIcons flex items-center justify-end flex-grow basis-1 gap-5 text-white font-bold text-2xl">
          {setting.info ? (
            <MdInfo
              className="cursor-pointer text-[#a8c7fa]"
              onClick={(e) => {
                setSettings((prev) => ({ ...prev, info: false }));
              }}
            />
          ) : (
            <MdInfoOutline
              className="cursor-pointer"
              onClick={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  info: true,
                  users: false,
                  message: false,
                  activities: false,
                  setting: false,
                }));
              }}
            />
          )}
          {setting.users ? (
            <HiUsers
              className="cursor-pointer text-[#a8c7fa]"
              onClick={(e) => {
                setSettings((prev) => ({ ...prev, users: false }));
              }}
            />
          ) : (
            <HiOutlineUsers
              className="cursor-pointer"
              onClick={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  info: false,
                  users: true,
                  message: false,
                  activities: false,
                  setting: false,
                }));
              }}
            />
          )}
          {setting.message ? (
            <MdMessage
              className="cursor-pointer text-[#a8c7fa]"
              onClick={(e) => {
                setSettings((prev) => ({ ...prev, message: false }));
              }}
            />
          ) : (
            <MdOutlineMessage
              className="cursor-pointer"
              onClick={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  info: false,
                  users: false,
                  message: true,
                  activities: false,
                  setting: false,
                }));
              }}
            />
          )}
          {setting.activities ? (
            <RiShapesFill
              className="cursor-pointer text-[#a8c7fa]"
              onClick={(e) => {
                setSettings((prev) => ({ ...prev, activities: false }));
              }}
            />
          ) : (
            <RiShapesLine
              className="cursor-pointer"
              onClick={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  info: false,
                  users: false,
                  message: false,
                  activities: true,
                  setting: false,
                }));
              }}
            />
          )}
          {meetDetails?.admin.email === session.data?.user?.email &&
          setting.setting ? (
            <MdLockPerson
              className="cursor-pointer text-[#a8c7fa]"
              onClick={(e) => {
                setSettings((prev) => ({ ...prev, setting: false }));
              }}
            />
          ) : (
            <MdOutlineLockPerson
              className="cursor-pointer"
              onClick={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  info: false,
                  users: false,
                  message: false,
                  activities: false,
                  setting: true,
                }));
              }}
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default BottomBar;
