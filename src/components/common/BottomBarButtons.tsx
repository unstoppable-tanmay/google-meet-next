import React, { ReactNode } from "react";

const BottomBarButtons = ({
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
    <button
      onClick={onClick}
      className={`duration-200 ${
        state
          ? "outline-none border-none p-3 px-4 rounded-2xl bg-[#a7c8fb]"
          : "outline-none border-none p-3 px-4 rounded-full bg-white/5 hover:bg-white/15"
      }`}
      // animate={state ? { borderRadius: "9999px" } : { borderRadius: "16px" }}
    >
      {state ? onIcon : offIcon}
    </button>
  );
};

export default BottomBarButtons;
