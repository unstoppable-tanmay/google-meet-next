"use client";

import React, { useEffect,useState } from "react";
import { useRecoilState } from "recoil";

import Icon from "../Icon";

import { BiVideo } from "react-icons/bi";
import { HiOutlineCog } from "react-icons/hi";
import { MdOutlineSpeaker } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

import { settingsState } from "@/state/atom";
import Audio from "./Tabs/Audio";
import Video from "./Tabs/Video";
import { useMediaStream } from "@/provider/MediaProvider";

const Settings = () => {
  const [tab, setTab] = useState(0);

  const [open, setOpen] = useRecoilState(settingsState);

  useEffect(() => {
    if (!document) return;
    if (open) {
      document.body.style.height = "100vh";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.height = "auto";
      document.body.style.overflowY = "scroll";
    }
  }, [open]);

  return (
    <section
      className="w-screen h-screen absolute flex items-center justify-center bg-black/25 z-[500]"
      style={{
        background: open ? "rgba(0,0,0,0.25)" : "transparent",
        pointerEvents: open ? "all" : "none",
      }}
    >
      {open && (
        <div
          className="outer absolute w-full h-full z-[600]"
          onClick={(e) => setOpen(false)}
        ></div>
      )}
      {open ? (
        <div className="wrapper w-[clamp(200px,85%,800px)]  h-[92vh] rounded-md bg-white flex z-[700]">
          <div className="menu flex flex-col w-[clamp(50px,260px,300px)]">
            <div className="heading text-xl p-6 hidden md:flex">Settings</div>
            <div className="menu flex flex-col mt-10 md:mt-2 pr-2 font-medium text-black/50 text-[13px]">
              <div
                className={`item px-4 md:px-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 0
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(0)}
              >
                <MdOutlineSpeaker className="text-2xl" />
                <span className="hidden md:flex">Audio</span>
              </div>
              <div
                className={`audio px-4 md:px-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 1
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(1)}
              >
                <BiVideo className="text-2xl" />
                <span className="hidden md:flex">Video</span>
              </div>
              <div
                className={`audio px-4 md:px-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 2
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(2)}
              >
                <HiOutlineCog className="text-2xl" />
                <span className="hidden md:flex">General</span>
              </div>
            </div>
          </div>
          <div className="devider w-[.8px] h-full bg-black/20 flex-shrink-0"></div>
          <div className="content flex-1">
            <div className="heading flex items-center justify-end text-2xl px-3 py-2">
              <Icon onClick={(e) => setOpen(false)}>
                <IoCloseOutline />
              </Icon>
            </div>
            <div className="settings flex flex-col flex-1 gap-5 p-6 pr-12">
              {tab === 0 ? (
                <Audio />
              ) : tab === 1 ? (
                <Video />
              ) : (
                <div className="item flex flex-col gap-1"></div>
              )}
            </div>
          </div>
        </div>
      ) : (
        false
      )}
    </section>
  );
};

export default Settings;
