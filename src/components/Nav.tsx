"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Icon from "./common/Icon";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { BiCog } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { GoReport } from "react-icons/go";
import { TbMessageReport } from "react-icons/tb";

const Nav = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h24",
      }) +
        " • " +
        new Date().toLocaleString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
    );
    setInterval(() => {
      setTime(
        new Date().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hourCycle: "h24",
        }) +
          " • " +
          new Date().toLocaleString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
      );
    }, 6000);
  }, []);
  return (
    <nav className="flex w-full justify-between items-center px-3 md:px-5 gap-4 select-none py-2.5 text-black/60">
      <div className="logo flex items-center gap-1 flex-shrink-0">
        <img src="/logo.png" alt="" className="logo max-h-8 md:max-h-10" />
        <span className="text-[22px] font-sans">Meet</span>
      </div>
      <div className="right flex gap-1 items-center bg-white">
        <div className="time font-sans hidden md:flex font-medium text-black/60 mr-1">
          {time}
        </div>
        <Icon className="text-xl hidden md:flex">
          <FaRegCircleQuestion />
        </Icon>
        <Icon className="text-2xl hidden md:flex">
          <TbMessageReport />
        </Icon>
        <Icon className="text-2xl">
          <BiCog />
        </Icon>
        <Icon className="text-2xl md:ml-5">
          <CgMenuGridO />
        </Icon>
        <div className="avtar p-1 md:p-1.5 hover:bg-black/5 rounded-full">
            <img src="/avtar.avif" alt="" className="min-w-8 w-8 aspect-square rounded-full object-cover" />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
