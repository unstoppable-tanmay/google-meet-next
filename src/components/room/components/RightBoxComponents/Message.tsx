import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";
import { AiOutlineSend } from "react-icons/ai";
import { useSocket } from "@/provider/SocketContext";
import { useSession } from "next-auth/react";
import { meetDetailsAtom, messagesAtom } from "@/state/JoinedRoomAtom";
import { Switch } from "@nextui-org/react";
import { MdDone } from "react-icons/md";

const Message = ({ room }: { room: string }) => {
  const [setting, setSettings] = useRecoilState(settings);
  const { socket } = useSocket();
  const session = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

  const sendMessage = () => {
    socket?.emit("message", {
      user: session.data?.user,
      roomName: room,
      message: message,
    });
    setMessage("");
  };

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
      <div className="notice m-3 text-xs font-medium text-gray-600/80 text-center bg-[#f2f3f5] rounded-md p-3 flex items-center justify-between">
        {`Let everyone send messages`}
        <Switch
          // isDisabled={!meetDetails?.settings.hostManagement}
          onValueChange={(e) => {
            setMeetDetails((prev) => ({
              ...prev!,
              settings: { ...prev!.settings, sendChatMessage: e },
            }));
          }}
          size="sm"
          color="default"
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <MdDone className={className} />
            ) : (
              <IoClose className={className} />
            )
          }
        ></Switch>
      </div>
      <div className="notice m-3 text-xs font-medium text-gray-600/80 text-center bg-[#f2f3f5] rounded-md p-3">
        {`Unless they're pinned, messages can only be seen by people in the call when the message is sent. All messages are deleted when the call ends.`}
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll px-4 basis-0 no-scrollbar gap-2">
        {messages.map((message) => (
          <div key={message.message} className="flex flex-col">
            <div className="user flex items-center gap-0.5">
              <div className="user font-semibold text-xs">{message.user}</div>
            </div>
            <div className="user text-black/70 text-sm">{message.message}</div>
          </div>
        ))}
      </div>
      <div className="messagebox m-3 rounded-full bg-[#f2f3f5] flex items-center justify-center px-4 py-3 gap-2">
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          className="w-full bg-transparent outline-none border-none text-sm"
        />
        <AiOutlineSend
          className="text-2xl text-black/60 cursor-pointer"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default Message;
