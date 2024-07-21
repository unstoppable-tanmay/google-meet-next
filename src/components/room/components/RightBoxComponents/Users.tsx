import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";
import { IoMdSearch } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Avatar } from "@nextui-org/react";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";
import { PeerDetailsType } from "@/types/types";
import Sound from "@/components/common/Sound";
import { HiDotsVertical } from "react-icons/hi";

const User = ({ user }: { user: PeerDetailsType }) => {
  return (
    <div className="flex items-center gap-2 w-full py-3 px-3">
      {user.image ? (
        <Avatar src={user.image} size="sm" className="select-none" />
      ) : (
        <Avatar name={user.name} size="sm" className="select-none" />
      )}
      <div className="flex flex-col flex-1 select-none">
        <div className="name font-medium text-sm text-ellipsis flex-1">
          {user.name}
        </div>
      </div>
      <Sound />
      <HiDotsVertical className="text-xl" />
    </div>
  );
};

const Users = () => {
  const [setting, setSettings] = useRecoilState(settings);

  const [userinmeeting, setUsersInMeeting] = useState(true);
  const [userraisedmeeting, setUsersRaisedMeeting] = useState(true);
  const [useroutsidemeeting, setUsersOutsidenMeeting] = useState(true);

  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

  return (
    <div className="flex flex-col h-full">
      <div className="header p-6 flex items-center justify-between text-[#5c5c5e]">
        <div className="heading font-medium text-xl">People</div>
        <IoClose
          className="text-2xl cursor-pointer"
          onClick={() => {
            setSettings((prev) => ({ ...prev, users: false }));
          }}
        />
      </div>
      <div className="search mx-3 mb-2 mt-1 p-2 border-[1.5px] border-gray-400/30 rounded-lg flex gap-2">
        <IoMdSearch className="text-2xl text-black/60" />
        <input
          type="text"
          className="outline-none bg-transparent w-full text-black/80"
          placeholder="Search for People"
        />
      </div>
      {/* Asking peers */}
      <>
        {meetDetails?.askingpeers.length! > 0 && (
          <>
            <div className="heading font-bold px-5 pt-2 pb-1 text-black/60 text-[13px]">
              ASKING TO JOIN
            </div>
            <div className="meetingpeople px-3 pb-2 flex flex-col w-full">
              <div className="users border-[1.5px] border-gray-400/30 rounded-lg w-full mt-1.5 flex-1 flex flex-col overflow-y-scroll no-scrollbar">
                <div
                  onClick={(e) => {
                    setUsersOutsidenMeeting((prev) => !prev);
                    setUsersInMeeting(false);
                    setUsersRaisedMeeting(false);
                  }}
                  className={
                    useroutsidemeeting
                      ? "header px-4 py-2.5 border-b-2 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
                      : "header px-4 py-2.5 border-b-0 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
                  }
                >
                  <div className="text font-medium select-none">Waiting</div>
                  <div className="icons flex gap-4 items-center justify-center">
                    <div className="usersCount select-none">{4}</div>
                    <FaChevronDown
                      className={
                        useroutsidemeeting
                          ? "cursor-pointer duration-200"
                          : "cursor-pointer rotate-180 duration-200"
                      }
                    />
                  </div>
                </div>
                <motion.div
                  animate={
                    useroutsidemeeting
                      ? {
                          height: "auto",
                          opacity: 1,
                        }
                      : {
                          height: "0",
                          opacity: 0,
                        }
                  }
                  className="users overflow-y-scroll no-scrollbar max-h-[250px]"
                >
                  {meetDetails?.askingpeers.map((e) => (
                    <User key={e.socketId} user={e} />
                  ))}
                </motion.div>
              </div>
            </div>
          </>
        )}
      </>

      {/* In Meeting */}
      <>
        <div className="heading font-bold px-5 pt-2 pb-1 text-black/60 text-[13px]">
          IN MEETING
        </div>
        <div className="meetingpeople px-3 pb-2 flex flex-col w-full">
          <div className="users border-[1.5px] border-gray-400/30 rounded-lg w-full mt-1.5 flex-1 flex flex-col overflow-y-scroll no-scrollbar">
            <div
              onClick={(e) => {
                setUsersInMeeting((prev) => !prev);
                setUsersOutsidenMeeting(false);
                setUsersRaisedMeeting(false);
              }}
              className={
                userinmeeting
                  ? "header px-4 py-2.5 border-b-2 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
                  : "header px-4 py-2.5 border-b-0 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
              }
            >
              <div className="text font-medium select-none">Contributers</div>
              <div className="icons flex gap-4 items-center justify-center">
                <div className="usersCount select-none">
                  {meetDetails?.peers.length}
                </div>
                <FaChevronDown
                  className={
                    userinmeeting
                      ? "cursor-pointer duration-200"
                      : "cursor-pointer rotate-180 duration-200"
                  }
                />
              </div>
            </div>
            <motion.div
              animate={
                userinmeeting
                  ? {
                      height: "auto",
                      opacity: 1,
                      // padding:"16px"
                    }
                  : {
                      height: "0",
                      opacity: 0,
                      // padding:["16px","0"]
                    }
              }
              className="users overflow-y-scroll no-scrollbar max-h-[250px]"
            >
              {meetDetails?.peers.map((e) => (
                <User key={e.socketId} user={e} />
              ))}
            </motion.div>
          </div>
        </div>
      </>

      {/* Raised Peers */}
      <>
        {meetDetails?.raisedPeers.length! > 0 && (
          <>
            <div className="heading font-bold px-5 pt-2 pb-1 text-black/60 text-[13px]">
              HAND RAISED
            </div>
            <div className="meetingpeople px-3 pb-2 flex flex-col w-full">
              <div className="users border-[1.5px] border-gray-400/30 rounded-lg w-full mt-1.5 flex-1 flex flex-col overflow-y-scroll no-scrollbar">
                <div
                  onClick={(e) => {
                    setUsersRaisedMeeting((prev) => !prev);
                    setUsersOutsidenMeeting(false);
                    setUsersInMeeting(false);
                  }}
                  className={
                    userraisedmeeting
                      ? "header px-4 py-2.5 border-b-2 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
                      : "header px-4 py-2.5 border-b-0 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
                  }
                >
                  <div className="text font-medium select-none">
                    Raised People
                  </div>
                  <div className="icons flex gap-4 items-center justify-center">
                    <div className="usersCount select-none">
                      {meetDetails?.peers.length}
                    </div>
                    <FaChevronDown
                      className={
                        userraisedmeeting
                          ? "cursor-pointer duration-200"
                          : "cursor-pointer rotate-180 duration-200"
                      }
                    />
                  </div>
                </div>
                <motion.div
                  animate={
                    userraisedmeeting
                      ? {
                          height: "auto",
                          opacity: 1,
                          // padding:"16px"
                        }
                      : {
                          height: "0",
                          opacity: 0,
                          // padding:["16px","0"]
                        }
                  }
                  className="users overflow-y-scroll no-scrollbar max-h-[250px]"
                >
                  {meetDetails?.raisedPeers.map((e) => (
                    <User key={e.socketId} user={e} />
                  ))}
                </motion.div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default Users;
