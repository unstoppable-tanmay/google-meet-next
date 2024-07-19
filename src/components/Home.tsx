"use client";

import React, { useEffect, useState } from "react";
import Carousel from "./common/Carousel";

import { MdKeyboard, MdOutlineCalendarToday } from "react-icons/md";
import { BiVideoPlus } from "react-icons/bi";
import { IoMdLink } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { isLinkOrCode, isValidRoomId } from "@/lib/room-id";
import Nav from "./Nav";
import Settings from "./common/Settings/Settings";
import { useRecoilState } from "recoil";
import { joined, settingsState } from "@/state/atom";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ServerResponse } from "@/types/types";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const Home = () => {
  const session = useSession();

  const [focus, setFocus] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [open, setOpen] = useRecoilState(settingsState);
  const [join, setJoin] = useRecoilState(joined);

  const [loading, setLoading] = useState(true);

  const [meetForLaterModal, setMeetForLaterModal] = useState(false);

  const router = useRouter();

  const handleCreateMeetForLater = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };

  const handleStartInstantMeet = async () => {
    try {
      if (session.status !== "authenticated")
        return toast("YOu have to signin for creating meet", {
          hideProgressBar: true,
          type: "info",
          position: "bottom-right",
        });
      setLoading(true);
      if (session.status === "authenticated") {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/createInstantMeet`,
          {
            user: {
              name: session.data?.user?.name,
              email: session.data?.user?.email,
              image: session.data?.user?.image,
            },
            settings: {
              shareScreen: true,
              sendChatMessage: true,
              sendReaction: true,
              turnOnMic: true,
              turnOnVideo: true,
              hostMustJoinBeforeAll: true,
              access: "trusted",
            },
          }
        );
        const data: ServerResponse<{ id: string }> = res.data;

        if (data.success) {
          setJoin("joined");
          router.push(`/${data.data?.id}`);
        } else {
          toast("Some Error Happened", {
            hideProgressBar: true,
            type: "info",
            position: "bottom-right",
          });
        }
      } else {
        toast("You Should Signed In", {
          hideProgressBar: true,
          type: "info",
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast("Some Error Happened", {
        hideProgressBar: true,
        type: "info",
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeetWithSchedule = () => {
    toast("not implemented yet", {
      hideProgressBar: true,
      type: "info",
      position: "bottom-right",
    });
  };

  useEffect(() => {
    if (session.status !== "loading") setLoading(false);
  }, [session]);

  return (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 0.8, 0.8, 0.8, 0.8] }}
          transition={{ duration: 1 }}
          className="layer w-full h-full bg-black absolute pointer-events-none opacity-0 flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000]"
        >
          Loading . . .
        </motion.div>
      )}
      <Nav />
      <motion.section
        transition={{ duration: 0.8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col lg:flex-row items-center justify-between px-5 md:px-[5%] md:gap-10 xl:gap-20 flex-1 no-scrollbar md:py-5 xl:py-0"
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
                <div className="startbtn py-3 px-3 flex-shrink-0 rounded-[4px] bg-[#1a6dde]/95 hover:bg-[#1a6dde] text-white flex gap-1 items-center justify-center cursor-pointer relative select-none ">
                  <BiVideoPlus className="text-xl font-bold flex-shrink-0" />
                  <span className=" font-medium flex-shrink-0">
                    New meeting
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
                <>
                  <div
                    onClick={handleCreateMeetForLater}
                    className="item w-full cursor-pointer flex flex-shrink-0 items-center py-3 px-4 gap-8 text-black hover:bg-black/10"
                  >
                    <IoMdLink className="text-xl flex-shrink-0" />
                    <span className="flex-shrink-0">
                      Create a meeting for later
                    </span>
                  </div>
                  <div
                    onClick={handleStartInstantMeet}
                    className="item w-full cursor-pointer flex flex-shrink-0 items-center py-3 px-4 gap-8 text-black hover:bg-black/10"
                  >
                    <FaPlus className="text-xl flex-shrink-0" />
                    <span className="flex-shrink-0">
                      Start a instant meeting
                    </span>
                  </div>
                  <div
                    onClick={handleCreateMeetWithSchedule}
                    className="item w-full cursor-pointer flex flex-shrink-0 items-center py-3 px-4 gap-8 text-black hover:bg-black/10"
                  >
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
                  if (isLinkOrCode(roomId) == "code") {
                    setRoomId("");
                    router.push("/" + roomId);
                  } else if (isLinkOrCode(roomId) == "link") {
                    setRoomId("");
                    router.push(roomId);
                  }
                }}
              >
                Join
              </button>
            </div>
          </div>
          <div className="devider w-full h-[1px] bg-black/15 my-5"></div>
          <div className="learnmore text-black/60 font-medium hidden xl:flex gap-1.5">
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
            Learn More{" "}
          </a>
          about Google Meet
        </div>
      </motion.section>
      {open && <Settings key={"asoidnhaoloisnd"} />}
    </>
  );
};

export default Home;
