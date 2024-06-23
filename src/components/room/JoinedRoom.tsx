import React from "react";
import BottomBar from "./components/BottomBar";

import { joined } from "@/state/atom";
import { useRecoilState } from "recoil";

const JoinedRoom = () => {
  const [join, setJoin] = useRecoilState(joined);
  return (
    <section className="w-full h-screen overflow-hidden bg-[#202124] flex flex-col">
      <div className="video-area flex-1"></div>
      <BottomBar />
    </section>
  );
};

export default JoinedRoom;
