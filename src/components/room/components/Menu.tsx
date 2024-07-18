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
          className={`text-xl font-bold p-[.7rem] rounded-full duration-200 bg-white/15 hover:bg-white/25 outline-none`}
        >
          <BsThreeDotsVertical />
        </div>
      </PopoverTrigger>
      <PopoverContent className="shadow-lg max-h-[50vh] rounded-md bg-gray-700 z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
        <>asfasfas</>
      </PopoverContent>
    </Popover>
  );
};

export default Menu;
