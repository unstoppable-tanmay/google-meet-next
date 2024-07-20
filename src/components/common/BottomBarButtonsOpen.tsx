import { motion } from "framer-motion";
import React, { ReactNode } from "react";

const BottomBarButtonsOpen = ({
  onIcon,
  offIcon,
  onClick,
  state,
}: {
  onIcon: ReactNode;
  offIcon: ReactNode;
  onClick: () => void;
  state: boolean;
}) => {
  return (
    <motion.div
      className={`duration-200 ${
        state
          ? "flex items-center pl-3.5 gap-2 rounded-full bg-white/5"
          : "flex items-center pl-3.5 gap-2 rounded-2xl bg-[#63120f]"
      }`}
      // animate={state ? { borderRadius: "9999px" } : { borderRadius: "16px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="21px"
        fill="#e8eaed"
        className="opacity-50"
      >
        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
      </svg>
      <motion.button
        onClick={onClick}
        className={`duration-200 ${
          state
            ? "outline-none border-none p-3 rounded-full bg-white/5"
            : "outline-none border-none p-3 rounded-2xl bg-[#f9ddda]"
        }`}
        // animate={state ? { borderRadius: "9999px" } : { borderRadius: "16px" }}
      >
        {state ? onIcon : offIcon}
      </motion.button>
    </motion.div>
  );
};

export default BottomBarButtonsOpen;
