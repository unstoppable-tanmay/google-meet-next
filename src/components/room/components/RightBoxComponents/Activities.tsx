import React from "react";
import { IoClose } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";

const Activities = () => {
  const [setting, setSettings] = useRecoilState(settings);
  return (
    <div className="flex flex-col">
      <div className="header p-6 flex items-center justify-between text-[#5c5c5e]">
        <div className="heading font-medium text-xl">Activities</div>
        <IoClose
          className="text-2xl cursor-pointer"
          onClick={(e) => {
            setSettings((prev) => ({ ...prev, activities: false }));
          }}
        />
      </div>
      <div className="activities mx-4 px-3.5 py-5 pt-4 flex flex-col rounded-xl border-[1.6px] border=blacl/30">
        <div className="heading text-xs font-medium text-black/90">
          Featured add-ons
        </div>
        <div className="heading text-xs text-black/60">
        Install third-party add-ons to do more with Meet
        </div>
        <div className="apps my-6 w-full flex items-center justify-evenly">
          <div className="items flex flex-col gap-1.5 items-center justify-center">
            <div className="icon w-10 aspect-square rounded-full bg-[#e8f0fd]"></div>
            <div className="icon text-xs">Polly</div>
          </div>
          <div className="items flex flex-col gap-1.5 items-center justify-center">
            <div className="icon w-10 aspect-square rounded-full bg-[#e8f0fd]"></div>
            <div className="icon text-xs">Lucidpark</div>
          </div>
          <div className="items flex flex-col gap-1.5 items-center justify-center">
            <div className="icon w-10 aspect-square rounded-full bg-[#e8f0fd]"></div>
            <div className="icon text-xs">Miro</div>
          </div>
        </div>
          <div className="show-more text-sm text-[#3967a4] text-center w-full cursor-pointer">
            Show More
          </div>
      </div>

      <div className="google text-sm font-semibold text-black/70 mt-8 px-6">GOOGLE</div>
      <div className="item w-full flex items-center justify-center mt-6 gap-5 px-3">
        <div className="icon w-10 aspect-square rounded-full bg-[#e8f0fd]"></div>
        <div className="texts">
          <div className="heading ">Whiteboarding</div>
          <div className="heading text-xs text-black/50">
            Collaboratively brainstorm and sketch ideas
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
