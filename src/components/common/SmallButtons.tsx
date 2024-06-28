import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { motion } from "framer-motion";
import React, { MouseEventHandler, ReactNode } from "react";
import { HiChevronUp } from "react-icons/hi";

const SmallButtons = ({
  on = true,
  children,
  onColor = "#D94032",
  open = false,
  onClick,
}: {
  on: boolean;
  children: ReactNode;
  onColor?: string;
  open?: boolean;
  onClick?: MouseEventHandler;
}) => {
  return open ? (
    <div className="lg:flex lg:rounded-full lg:items-center lg:bg-white/10 lg:pl-1 lg:gap-0.5">
      <Popover placement="top-start">
        <PopoverTrigger>
          <div className="wrap max-lg:hidden">
            <HiChevronUp />
          </div>
        </PopoverTrigger>
        <PopoverContent>hello</PopoverContent>
      </Popover>

      <motion.button
        transition={{ duration: 0.1 }}
        style={{ background: on ? onColor : "rgb(255 255 255 / 0.15)" }}
        whileHover={{
          background: on ? onColor + "" : "rgb(255 255 255 / 0.25)",
        }}
        className={`text-xl font-bold p-[.7rem] rounded-full duration-200 bg-white/15 hover:bg-white/25 outline-none`}
        onClick={onClick}
      >
        {children}
      </motion.button>
    </div>
  ) : (
    <motion.button
      transition={{ duration: 0.1 }}
      style={{ background: on ? onColor : "rgb(255 255 255 / 0.15)" }}
      whileHover={{ background: on ? onColor + "" : "rgb(255 255 255 / 0.25)" }}
      className={`text-xl font-bold p-[.7rem] rounded-full duration-200 bg-white/15 hover:bg-white/25 outline-none`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default SmallButtons;
