import React, { ReactNode } from "react";
import { motion } from "framer-motion";

const Icon = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  return (
    <motion.div
      className={
        "p-2 md:p-2.5 rounded-full hover:bg-black/5 flex items-center justify-center relative overflow-hidden" +
        " " +
        className
      }
      onClick={onClick}
    >
      <motion.div
        className="ripple absolute w-full h-full bg-black/20 z-100 rounded-full"
        initial={{ scale: 1, opacity: 0 }}
        whileTap={{
          scale: [0, 1],
          opacity: [0, 1],
        }}
      ></motion.div>
      {children}
    </motion.div>
  );
};

export default Icon;
