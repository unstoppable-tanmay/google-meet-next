import React from "react";
import BottomBar from "./components/BottomBar";

const JoinedRoom = () => {
  return (
    <section className="w-full h-screen overflow-hidden bg-[#202124] flex flex-col">
      
      <div className="video-area flex-1"></div>
      <BottomBar />
    </section>
  );
};

export default JoinedRoom;
