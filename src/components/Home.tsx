"use client";

import React, { useState } from "react";
import { BiVideoPlus } from "react-icons/bi";
import { MdKeyboard } from "react-icons/md";
import Carousel from "./common/Carousel";

const Home = () => {
  const [focus, setFocus] = useState(false);
  const [roomId, setRoomId] = useState("");
  return (
    <section className="w-full flex flex-col lg:flex-row items-center justify-between px-5 md:px-[5%] gap-20 flex-1">
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
          <div className="startbtn py-3 px-3 flex-shrink-0 rounded-[4px] bg-[#1a6dde]/95 hover:bg-[#1a6dde] text-white flex gap-1 items-center justify-center cursor-pointer">
            <BiVideoPlus className="text-xl font-bold flex-shrink-0" />
            <span className=" font-medium flex-shrink-0">New meeting</span>
          </div>
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
              disabled={roomId ? false : true}
            >
              Join
            </button>
          </div>
        </div>
        <div className="devider w-full h-[1px] bg-black/15 my-5"></div>
        <div className="learnmore text-black/60 font-medium hidden md:flex">
          <a href="" className="text-[#0b57d0]">
            Learn More
          </a>{" "}
          about Google Meet
        </div>
      </div>
      <div className="right xl:mr-28 pb-10 md:mb-0">
        <Carousel />
      </div>
      <div className="learnmore text-black/60 font-medium md:hidden text-center mb-4">
        <a href="" className="text-[#0b57d0]">
          Learn More
        </a>{" "}
        about Google Meet
      </div>
    </section>
  );
};

export default Home;
