import React from "react";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { MdContentCopy } from "react-icons/md";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";

const Info = () => {
  const pathname = usePathname();
  const [setting, setSettings] = useRecoilState(settings);
  return (
    <div className="flex flex-col">
      <div className="header p-6 flex items-center justify-between text-[#5c5c5e]">
        <div className="heading font-medium text-xl">Meeting details</div>
        <IoClose
          className="text-2xl cursor-pointer"
          onClick={(e) => {
            setSettings((prev) => ({ ...prev, info: false }));
          }}
        />
      </div>
      <div className="info p-6 pt-4 text-sm font-semibold text-[#5c5c5e] text-opacity-70">
        <div className="heading text-[#5c5c5e] text-opacity-90">
          Joining info
        </div>
        <div className="details mt-3">
          {window.location.origin + pathname} <br />
          <span className="text-[#5c5c5e] text-opacity-90 font-bold">
            Dial-in:{" "}
          </span>
          (IN) +91 700-865-1763 <br />
          <span className="text-[#5c5c5e] text-opacity-90 font-bold">
            PIN:{" "}
          </span>
          241 124 521
        </div>
        {/* <div className="phonewrapper flex">
          <div className="mt-3 font-semibold text-[#4271ac] px-3 py-1.5 text-[16px] rounded-full border-[1px] border-gray-400 flex items-center justify-center self-start cursor-pointer">
            More phone numbers
          </div>
        </div> */}

        <div className="copy mt-6 flex gap-2 items-center font-semibold text-[#5284ca] cursor-pointer">
          <MdContentCopy className="text-xl" /> Copy Joining Info
        </div>
      </div>
      <div className="devider w-full h-[1px] bg-gray-400/50 mt-2"></div>
      <div className="calander-info text-center px-6 mt-4 text-sm font-medium text-[#5c5c5e] text-opacity-70 ">
        Calander attachments will be shown below here
      </div>
    </div>
  );
};

export default Info;
