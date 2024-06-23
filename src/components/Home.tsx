"use client";

import React, { useState } from "react";
import Carousel from "./common/Carousel";
import OutsideClickDetector from "./common/OutsideClickDetector";

import { MdKeyboard, MdOutlineCalendarToday } from "react-icons/md";
import { BiVideoPlus } from "react-icons/bi";
import { IoMdLink } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { isLinkOrCode, isValidRoomId } from "@/lib/room-id";
import Nav from "./Nav";
import Settings from "./common/Settings/Settings";
import { useRecoilState } from "recoil";
import { settingsState } from "@/state/atom";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useRouter } from "next/navigation";

const Home = () => {
  const [focus, setFocus] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [openNewMeet, setOpenNewMeet] = useState(false);
  const [open, setOpen] = useRecoilState(settingsState);

  const router = useRouter();
  return (
    <>
      <Nav />
      <motion.section
        transition={{ duration: 0.8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col lg:flex-row items-center justify-between px-5 md:px-[5%] gap-20 flex-1 no-scrollbar"
      >
        <div className="left flex gap-4 flex-col h-full text-center md:text-left py-28 md:py-0">
          <div className="heading text-[clamp(43px,2.1vw,100px)] leading-[1.2] font-sans">
            Video calls and meetings for <br /> everyone
          </div>
          <div className="desc text-black/55 text-lg font-sans font-medium flex-wrap">
            Connect, collaborate and celebrate from anywhere with{" "}
            <br className="hidden md:flex" /> Google Meet
          </div>
          <br />
          <div className="buttons gap-6 flex flex-col md:flex-row items-center md:items-start">
            <Popover placement="bottom-start">
              <PopoverTrigger>
                <div
                  className="startbtn py-3 px-3 flex-shrink-0 rounded-[4px] bg-[#1a6dde]/95 hover:bg-[#1a6dde] text-white flex gap-1 items-center justify-center cursor-pointer relative select-none "
                  onClick={(e) => setOpenNewMeet(true)}
                >
                  <BiVideoPlus className="text-xl font-bold flex-shrink-0" />
                  <span className=" font-medium flex-shrink-0">
                    New meeting
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
                <>
                  <div className="item w-full flex flex-shrink-0 items-center py-3 px-4 gap-8 text-black hover:bg-black/10">
                    <IoMdLink className="text-xl flex-shrink-0" />
                    <span className="flex-shrink-0">
                      Create a meeting for later
                    </span>
                  </div>
                  <div className="item w-full flex flex-shrink-0 items-center py-3 px-4 gap-8 text-black hover:bg-black/10">
                    <FaPlus className="text-xl flex-shrink-0" />
                    <span className="flex-shrink-0">
                      Start a instant meeting
                    </span>
                  </div>
                  <div className="item w-full flex flex-shrink-0 items-center py-3 px-4 gap-8 text-black hover:bg-black/10">
                    <MdOutlineCalendarToday className="text-xl flex-shrink-0" />
                    <span className="flex-shrink-0">Schedule in Calander</span>
                  </div>
                </>
              </PopoverContent>
            </Popover>

            <div className="join flex gap-2">
              <div
                className="inputwrapper p-2.5 rounded-[4px] flex gap-2 items-center justify-center"
                style={{
                  margin: focus ? 0 : 1,
                  borderWidth: focus ? 2 : 1.5,
                  borderColor: focus ? "#0b57d0" : "#00000050",
                }}
              >
                <MdKeyboard className="text-2xl text-black/60" />
                <input
                  type="text"
                  className="outline-none border-none placeholder:text-black/60 placeholder:font-medium w-[clamp(80px,200px,200px)]"
                  placeholder="Enter a code or link"
                  onFocus={(e) => setFocus(true)}
                  onBlur={(e) => setFocus(false)}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
              <button
                className="join outline-none border-none bg-transparent font-medium ml-3 disabled:text-black/40 text-[#0b57d0} disabled:cursor-not-allowed"
                disabled={isValidRoomId(roomId) ? false : true}
                onClick={(e) => {
                  console.log(roomId);
                  if (isLinkOrCode(roomId) == "code") router.push("/" + roomId);
                  else if (isLinkOrCode(roomId) == "link") router.push(roomId);
                }}
              >
                Join
              </button>
            </div>
          </div>
          <div className="devider w-full h-[1px] bg-black/15 my-5"></div>
          <div className="learnmore text-black/60 font-medium hidden md:flex gap-1.5">
            <a href="" className="text-[#0b57d0]">
              Learn More{" "}
            </a>
            about Google Meet
          </div>
        </div>
        <div className="right xl:mr-24 pb-10 md:mb-0">
          <Carousel />
        </div>
        <div className="learnmore text-black/60 font-medium md:hidden text-center mb-4 flex">
          <a href="" className="text-[#0b57d0]">
            Learn More
          </a>
          about Google Meet
        </div>
      </motion.section>
      {open && <Settings />}
    </>
  );
};

export default Home;
