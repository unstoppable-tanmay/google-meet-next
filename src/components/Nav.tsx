"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import Icon from "./common/Icon";

import { FaRegCircleQuestion } from "react-icons/fa6";
import { TbMessageReport } from "react-icons/tb";
import { CgMenuGridO } from "react-icons/cg";
import { BiCog } from "react-icons/bi";

import { settingsState } from "@/state/atom";
import { signIn, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import User from "./common/User";

const Nav = () => {
  const [time, setTime] = useState("");
  const [openSettings, setOpenSettings] = useRecoilState(settingsState);

  const session = useSession();

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
    }, 60000);
  }, []);
  return (
    <nav className="flex w-full justify-between items-center px-3 md:px-5 gap-4 select-none py-2.5 text-black/60">
      <div className="logo flex items-center gap-1 flex-shrink-0">
        <img src="/logo.svg" alt="" className="logo max-h-8 md:max-h-10" />
        {/* <span className="text-[22px] font-sans">Meet</span> */}
      </div>
      {session.status == "authenticated" ? (
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
          <Icon className="text-2xl" onClick={(e) => setOpenSettings(true)}>
            <BiCog />
          </Icon>
          <Icon className="text-2xl md:ml-5">
            <CgMenuGridO />
          </Icon>
          <User user={session.data.user} />
        </div>
      ) : (
        <>
          <div
            className="signinbutton font-medium text-blue-400 hover:text-blue-500 cursor-pointer"
            onClick={(e) => signIn("google", { redirect: false })}
          >
            Sign In
          </div>
        </>
      )}
    </nav>
  );
};

export default Nav;
