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
import { RiShapesLine } from "react-icons/ri";
import { HiOutlineUsers, HiUsers } from "react-icons/hi";

const BottomBar = () => {
  const [setting, setSettings] = useRecoilState(settings);
  const [raiseHand, setRaiseHand] = useState(false);
  const [join, setJoin] = useRecoilState(joined);
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
              console.log(setting.microphoneState);
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
              console.log(setting.cameraState);
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
              console.log(setting.caption);
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
              console.log(setting.emojies);
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
              console.log(setting.screenState);
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
          <MdInfoOutline className="cursor-pointer" /> {/* <MdInfo /> */}
          <HiOutlineUsers className="cursor-pointer" /> {/* <HiUsers /> */}
          <MdOutlineMessage className="cursor-pointer" /> {/* <MdMessage /> */}
          <RiShapesLine className="cursor-pointer" /> {/* <RiShapesFill /> */}
          <MdOutlineLockPerson className="cursor-pointer" />{" "}
          {/* <MdLockPerson /> */}
        </div>
      </nav>
    </div>
  );
};

export default BottomBar;
