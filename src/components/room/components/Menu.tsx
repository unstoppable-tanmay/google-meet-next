import SmallButtons from "@/components/common/SmallButtons";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { motion } from "framer-motion";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const Menu = () => {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <div
          className={`text-xl font-bold p-2 rounded-full duration-200 bg-white/5 hover:bg-white/15 outline-none flex items-center justify-center`}
        >
          <BsThreeDotsVertical />
        </div>
      </PopoverTrigger>
      <PopoverContent className="shadow-lg max-h-[50vh] rounded-md bg-[#181b20] p-3 text-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
        <>
        <div className="whiteBoard w-full flex items-center gap-4">
          
        </div>
        </>
      </PopoverContent>
    </Popover>
  );
};

export default Menu;
