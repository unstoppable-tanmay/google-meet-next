import React from "react";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { MdContentCopy } from "react-icons/md";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";
import { AiOutlineSend } from "react-icons/ai";

const Message = () => {
  const pathname = usePathname();
  const [setting, setSettings] = useRecoilState(settings);
  return (
    <div className="flex flex-col h-full">
      <div className="header p-6 flex items-center justify-between text-[#5c5c5e]">
        <div className="heading font-medium text-xl">In-call messages</div>
        <IoClose
          className="text-2xl cursor-pointer"
          onClick={() => {
            setSettings((prev) => ({ ...prev, message: false }));
          }}
        />
      </div>
      <div className="notice m-3 text-xs font-medium text-gray-600/80 text-center bg-[#f2f3f5] rounded-md p-3">
        {`Unless they're pinned, messages can only be seen by people in the call when the message is sent. All messages are deleted when the call ends.`}
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll px-4 basis-0 no-scrollbar"></div>
      <div className="messagebox m-3 rounded-full bg-[#f2f3f5] flex items-center justify-center px-4 py-3 gap-2">
        <input
          type="text"
          className="w-full bg-transparent outline-none border-none text-sm"
        />
        <AiOutlineSend className="text-2xl text-black/60 cursor-pointer" />
      </div>
    </div>
  );
};

export default Message;
