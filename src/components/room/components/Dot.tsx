import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import React from "react";
import { BiVideoPlus } from "react-icons/bi";

const Dot = () => {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <div className="startbtn py-3 px-3 flex-shrink-0 rounded-[4px] bg-[#1a6dde]/95 hover:bg-[#1a6dde] text-white flex gap-1 items-center justify-center cursor-pointer relative select-none ">
          <BiVideoPlus className="text-xl font-bold flex-shrink-0" />
          <span className=" font-medium flex-shrink-0">New meeting</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
        <></>
      </PopoverContent>
    </Popover>
  );
};

export default Dot;
