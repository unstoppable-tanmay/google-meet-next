import { motion } from "framer-motion";
import React, { MouseEventHandler, ReactNode } from "react";

const Button = ({
  on = true,
  children,
  onClick
}: {
  on: boolean;
  children: ReactNode;
  onClick?: MouseEventHandler
}) => {
  return (
    <motion.button
      style={{
        borderColor: on ? "#ffffff" : "transparent",
        background: on ? "transparent" : "#D94032",
      }}
      whileHover={{
        background: on ? "#FFFFFF70" : "#C83B2E",
      }}
      className={`text-xl md:text-2xl p-2 md:p-4 rounded-full duration-200 border-[1px] border-white outline-none bg-[${on ? "#00000000" : "#D94032"}] hover:bg-[${
        on ? "#FFFFFF20" : "#C83B2E"
      }]`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;
