import Button from "@/components/common/Button";
import React from "react";

import { FiMic, FiMicOff, FiUsers } from "react-icons/fi";
import { BiVideo, BiVideoOff } from "react-icons/bi";
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
  const [join, setJoin] = useRecoilState(joined);
  return (
    <div className="wrapper flex flex-col">
      <div className="emojies"></div>
      <nav className="w-full flex items-center justify-between px-6 py-5 text-white/80">
        <div className="meetname font-medium tracking-wide flex-grow basis-1">
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
            {setting.microphoneState ? <FiMic /> : <FiMicOff />}
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
            on={setting.caption}
            onClick={(e) => {
              console.log(setting.caption);
              setSettings((prev) => ({
                ...prev,
                caption: !setting.caption,
              }));
            }}
          >
            <MdOutlineEmojiEmotions />
          </SmallButtons>
          <SmallButtons
            on={setting.caption}
            onClick={(e) => {
              console.log(setting.caption);
              setSettings((prev) => ({
                ...prev,
                caption: !setting.caption,
              }));
            }}
          >
            <LuScreenShare />
            {/* <LuScreenShareOff/> */}
          </SmallButtons>
          <SmallButtons
            on={setting.caption}
            onClick={(e) => {
              console.log(setting.caption);
              setSettings((prev) => ({
                ...prev,
                caption: !setting.caption,
              }));
            }}
          >
            <FaRegHandPaper />
          </SmallButtons>
          <SmallButtons
            on={setting.caption}
            onClick={(e) => {
              console.log(setting.caption);
              setSettings((prev) => ({
                ...prev,
                caption: !setting.caption,
              }));
            }}
          >
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
        <div className="lastIcons flex items-center justify-end flex-grow basis-1 gap-5 text-white font-bold text-xl">
          <MdInfoOutline /> {/* <MdInfo /> */}
          <HiOutlineUsers /> {/* <HiUsers /> */}
          <MdOutlineMessage /> {/* <MdMessage /> */}
          <RiShapesLine /> {/* <RiShapesFill /> */}
          <MdOutlineLockPerson /> {/* <MdLockPerson /> */}
        </div>
      </nav>
    </div>
  );
};

export default BottomBar;
