import SmallButtons from "@/components/common/SmallButtons";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const Dot = () => {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <SmallButtons on={false} onColor="#87b3f8">
          <BsThreeDotsVertical />
        </SmallButtons>
      </PopoverTrigger>
      <PopoverContent className="shadow-lg max-h-[50vh] rounded-md bg-white z-[1100] flex flex-col overflow-y-scroll no-scrollbar px-0">
        <></>
      </PopoverContent>
    </Popover>
  );
};

export default Dot;
