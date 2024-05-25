/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Icon from "./Icon";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const data = [
  {
    image: 0,
    heading: "Get a link that you can share",
    desc: "Click <strong>New Meeting</strong> to get  a link that you can send to people that you want to meet with",
  },
  {
    image: 1,
    heading: "Plan ahead",
    desc: "Click <strong>New Meeting</strong> to get a link that you can send to people that you want to meet with",
  },
  {
    image: 2,
    heading: "Your meeting is safe",
    desc: "No one can join a meeting unless invited or admitted by the host",
  },
];

const Carousel = () => {
  const [page, setPage] = useState(1);
  const [move, setMove] = useState<"right" | "left">("right");
  return (
    <div className="flex items-center ">
      <Icon
        className="md:p-3.5 -mt-36"
        onClick={(e) => {
          setMove("left");
          setPage((prev) => (prev > 0 ? prev - 1 : 2));
        }}
      >
        <FaAngleLeft className=" text-black/70" />
      </Icon>
      <div className="content flex flex-col gap-12 items-center">
        <img
          src={`/carousel/${data[page].image}.svg`}
          alt=""
          className="w-[clamp(50px,170px,200px)] md:w-[clamp(50px,240px,250px)] rounded-full object-cover"
        />
        <motion.div
          initial={
            move == "left"
              ? { opacity: 0, translateX: "-100px" }
              : { opacity: 0, translateX: "100px" }
          }
          animate={
            move == "left"
              ? { opacity: 1, translateX: "0px" }
              : { opacity: 1, translateX: "0px" }
          }
          exit={
            move == "left"
              ? { opacity: 1, translateX: "100px" }
              : { opacity: 1, translateX: "-100px" }
          }
          key={data[page].heading}
          className="text flex gap-4 items-center justify-center text-center w-[clamp(50px,270px,250px)] md:w-[clamp(50px,350px,350px)] flex-col"
        >
          <div className="heading text-2xl">{data[page].heading}</div>
          <div
            className="desc text-sm"
            dangerouslySetInnerHTML={{ __html: data[page].desc }}
          />
        </motion.div>
        <ul className="navigator flex gap-2 -mt-7">
          <li
            style={{ background: page === 0 ? "#0b57d0" : "#00000020" }}
            className="w-[5.7px] aspect-square rounded-full bg-black/20"
            onClick={e=>setPage(0)}
          ></li>
          <li
            style={{ background: page === 1 ? "#0b57d0" : "#00000020" }}
            className="w-[5.7px] aspect-square rounded-full bg-black/20"
            onClick={e=>setPage(1)}
          ></li>
          <li
            style={{ background: page === 2 ? "#0b57d0" : "#00000020" }}
            className="w-[5.7px] aspect-square rounded-full bg-black/20"
            onClick={e=>setPage(2)}
          ></li>
        </ul>
      </div>
      <Icon
        className="md:p-3.5 -mt-36"
        onClick={(e) => {
          setMove("right");
          setPage((prev) => (prev < 2 ? prev + 1 : 0));
        }}
      >
        <FaAngleRight className=" text-black/70" />
      </Icon>
    </div>
  );
};

export default Carousel;
