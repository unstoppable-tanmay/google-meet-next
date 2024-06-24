/* eslint-disable @next/next/no-img-element */
import { UserType } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import React from "react";

const User = ({ user }: { user: UserType }) => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <div className="avtar p-1 md:p-1.5 hover:bg-black/5 rounded-full">
          <img
            src={user?.image || "/avtar.avif"}
            alt=""
            className="min-w-8 w-8 aspect-square rounded-full object-cover"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-1 p-2">
          <div className="name font-medium">{user?.name}</div>
          <div className="email text-sm">{user?.email}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default User;
