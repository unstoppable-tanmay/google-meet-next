"use client";

import React, { useState } from "react";
import { useRecoilState } from "recoil";

import Icon from "./Icon";

import { BiVideo } from "react-icons/bi";
import { HiOutlineCog } from "react-icons/hi";
import { MdOutlineSpeaker } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

import { settingsState } from "@/state/atom";

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useRecoilState(settingsState);

  return (
    <section
      className="w-screen h-screen absolute flex items-center justify-center bg-black/25"
      style={{
        background: open ? "rgba(0,0,0,0.25)" : "transparent",
        pointerEvents: open ? "all" : "none",
      }}
    >
      {open ? (
        <div className="wrapper w-[clamp(200px,85%,800px)]  h-[92vh] rounded-md bg-white flex ">
          <div className="menu flex flex-col w-[clamp(50px,260px,300px)]">
            <div className="heading text-xl p-6 hidden md:flex">Settings</div>
            <div className="menu flex flex-col mt-2 pr-2 font-semibold text-black/50 text-[13px]">
              <div
                className={`item p-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 0
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(0)}
              >
                <MdOutlineSpeaker className="text-2xl" />
                Audio
              </div>
              <div
                className={`audio p-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 1
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(1)}
              >
                <BiVideo className="text-2xl" />
                Video
              </div>
              <div
                className={`audio p-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 2
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(2)}
              >
                <HiOutlineCog className="text-2xl" />
                General
              </div>
            </div>
          </div>
          <div className="devider w-[.8px] h-full bg-black/20"></div>
          <div className="content flex-1">
            <div className="heading flex items-center justify-end text-2xl px-3 py-2">
              <Icon onClick={(e) => setOpen(false)}>
                <IoCloseOutline />
              </Icon>
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
