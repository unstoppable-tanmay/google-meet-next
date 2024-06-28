/* eslint-disable @next/next/no-img-element */
import { UserType } from "@/types/types";
import { signIn } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import React, { useState } from "react";

const User = ({ user }: { user: UserType }) => {
  const [image, setImage] = useState(
    user?.image ||
      "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
  );
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <div className="avtar p-1 md:p-1.5 hover:bg-black/5 rounded-full">
          <img
            onError={(e) => {
              setImage(
                "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
              );
            }}
            src={image}
            alt=""
            className="min-w-8 w-8 aspect-square rounded-full bg-gray-500 object-cover"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-1 p-2">
          <div className="name font-medium">{user?.name}</div>
          <div className="email text-sm">{user?.email}</div>
          <button
            className="w-full rounded-lg mt-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 duration-150"
            onClick={(e) => signIn("google")}
          >
            Switch Account
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default User;
