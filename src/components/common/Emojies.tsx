/* eslint-disable @next/next/no-img-element */
import { emojiesColorAtom } from "@/state/JoinedRoomAtom";
import { motion } from "framer-motion";
import React from "react";
import { useRecoilState } from "recoil";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

const Emojies = () => {
  const [emojiesColor, setEmojiesColor] = useRecoilState(emojiesColorAtom);
  const map = [
    { color: "#ffca28", value: "" },
    { color: "#70534a", value: "_dark-skin-tone" },
    { color: "#a56c43", value: "_medium-dark-skin-tone" },
    { color: "#ba8d68", value: "_medium-skin-tone" },
    { color: "#e0bb95", value: "_medium-light-skin-tone" },
    { color: "#f9ddbd", value: "_light-skin-tone" },
  ];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="emojies rounded-full bg-white/10 px-5 py-2 text-xl tracking-[5px] flex gap-4"
      >
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src="/emojies/sparkling-heart.png"
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src={`/emojies/thumbs-up${emojiesColor}.png`}
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src="/emojies/party-popper.png"
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src={`/emojies/clapping-hands${emojiesColor}.png`}
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src="/emojies/face-with-tears-of-joy.png"
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src="/emojies/face-with-open-mouth.png"
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src="/emojies/crying-face.png"
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src="/emojies/thinking-face.png"
          alt=""
        />
        <img
          className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
          src={`/emojies/thumbs-down${emojiesColor}.png`}
          alt=""
        />
      </motion.div>

      <Popover placement="top-start">
        <PopoverTrigger>
          <div className="select w-8 aspect-square rounded-full border-2 border-white/30 p-[2.5px] -mr-6 opacity-0 group-hover:opacity-100 duration-300 cursor-pointer">
            <div className="color bg-[#ffca28] w-full h-full rounded-full"></div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="px-2 py-1 rounded-full bg-white/15 flex flex-row gap-1.5">
          {map.map((color) => (
            <div
              key={color.value}
              onClick={(e) => {
                setEmojiesColor(
                  color.value as
                    | ""
                    | "_dark-skin-tone"
                    | "_medium-dark-skin-tone"
                    | "_medium-skin-tone"
                    | "_medium-light-skin-tone"
                    | "_light-skin-tone"
                );
              }}
              style={{ background: color.color }}
              className={`color w-6 aspect-square rounded-full`}
            ></div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Emojies;
