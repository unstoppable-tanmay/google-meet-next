import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { MdContentCopy } from "react-icons/md";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { motion } from "framer-motion";

const Users = () => {
  const pathname = usePathname();
  const [setting, setSettings] = useRecoilState(settings);
  const [userinmeeting, setUsersInMeeting] = useState(true);
  const [useroutsidemeeting, setUsersOutsidenMeeting] = useState(true);
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
      <div className="search mx-3 my-2 p-2 border-[1.5px] border-gray-400/30 rounded-lg flex gap-2">
        <IoMdSearch className="text-3xl text-black/60" />
        <input
          type="text"
          className="outline-none bg-transparent w-full text-lg text-black/80"
          placeholder="Search for People"
        />
      </div>
      <div className="heading font-bold px-5 pt-2 pb-1 text-black/60 text-[13px]">
        ASKING TO JOIN
      </div>
      <div className="meetingpeople px-3 pb-2 flex flex-col w-full">
        <div className="users border-[1.5px] border-gray-400/30 rounded-lg w-full mt-1.5 flex-1 flex flex-col overflow-y-scroll no-scrollbar">
          <div
            onClick={(e) => {
              setUsersOutsidenMeeting((prev) => !prev);
              setUsersInMeeting(false);
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ad
            enim quaerat at odit. Ullam quas totam necessitatibus suscipit,
            beatae eveniet. Quo nam beatae iste magni odit porro eum, dolores
            amet maiores ullam eligendi numquam in ducimus ad exercitationem
            sit, odio ratione quidem quia enim, at distinctio accusamus! Impedit
            eveniet id atque quidem. Molestiae reprehenderit magni voluptatem,
            earum animi, aperiam natus error incidunt voluptas soluta, ab sunt!
            Maxime facere delectus nihil voluptatibus odit voluptate aperiam
            quam qui temporibus fuga nemo, veniam corrupti! Praesentium
            repudiandae provident laudantium eius temporibus architecto natus!
            Dolore velit aut voluptas animi vel atque natus cupiditate qui.
          </motion.div>
        </div>
      </div>
      <div className="heading font-bold px-5 pt-2 pb-1 text-black/60 text-[13px]">
        IN MEETING
      </div>
      <div className="meetingpeople px-3 pb-2 flex flex-col w-full">
        <div className="users border-[1.5px] border-gray-400/30 rounded-lg w-full mt-1.5 flex-1 flex flex-col overflow-y-scroll no-scrollbar">
          <div
            onClick={(e) => {
              setUsersInMeeting((prev) => !prev);
              setUsersOutsidenMeeting(false);
            }}
            className={
              userinmeeting
                ? "header px-4 py-2.5 border-b-2 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
                : "header px-4 py-2.5 border-b-0 border-gray-400/30 flex items-center justify-between text-sm w-full h-10"
            }
          >
            <div className="text font-medium select-none">Contributers</div>
            <div className="icons flex gap-4 items-center justify-center">
              <div className="usersCount select-none">{4}</div>
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
                  }
                : {
                    height: "0",
                    opacity: 0,
                  }
            }
            className="users overflow-y-scroll no-scrollbar max-h-[250px]"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ad
            enim quaerat at odit. Ullam quas totam necessitatibus suscipit,
            beatae eveniet. Quo nam beatae iste magni odit porro eum, dolores
            amet maiores ullam eligendi numquam in ducimus ad exercitationem
            sit, odio ratione quidem quia enim, at distinctio accusamus! Impedit
            eveniet id atque quidem. Molestiae reprehenderit magni voluptatem,
            earum animi, aperiam natus error incidunt voluptas soluta, ab sunt!
            Maxime facere delectus nihil voluptatibus odit voluptate aperiam
            quam qui temporibus fuga nemo, veniam corrupti! Praesentium
            repudiandae provident laudantium eius temporibus architecto natus!
            Dolore velit aut voluptas animi vel atque natus cupiditate qui.
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Users;
