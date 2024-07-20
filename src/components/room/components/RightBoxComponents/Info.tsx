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
        <div className="heading text-[#5c5c5e]/95">Joining info</div>
        <div className="details mt-2">
          {window.location.origin + pathname} <br />
        </div>

        <div className="copy mt-3 flex gap-2 items-center font-semibold text-[#4a65a1] cursor-pointer">
          <MdContentCopy className="text-xl" /> Copy Joining Info
        </div>
      </div>
      <div className="devider w-full h-[1px] bg-gray-400/50 mt-0"></div>
      <div className="calander-info text-center px-6 mt-4 text-sm font-medium text-[#5c5c5e] text-opacity-70 ">
        Calander attachments will be shown below here
      </div>
    </div>
  );
};

export default Info;
