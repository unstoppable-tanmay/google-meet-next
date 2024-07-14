"use client";

import Home from "@/components/Home";
import { joined } from "@/state/atom";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { ToastContainer } from "react-toastify";
import { MediaStreamProvider } from "@/provider/MediaProvider";

export default function Page() {
  const [join, setJoin] = useRecoilState(joined);

  useEffect(() => {
    setJoin("joining");
  }, [setJoin]);

  return (
    <MediaStreamProvider>
      <main className="min-h-screen flex flex-col relative no-scrollbar">
        {JSON.parse(process.env.NEXT_PUBLIC_PROBLEM!) && (
          <div className="problem w-full h-full absolute bg-black/50 flex items-center justify-center z-[3000] text-2xl text-white font-semibold">
            There Is Some Error Occured In Server, <br /> Fixing🛠️..., it will
            Live soon 🙃
          </div>
        )}
        <ToastContainer />
        <Home />
        {process.env.NEXT_PUBLIC_NOTICE && (
          <div className="notice w-full text-center text-sm font-medium py-2 bg-red-400/30 px-4">
            This is a ongoing project, only some of the features are
            implemented, I am trying to complete it as soon as possible
          </div>
        )}
      </main>
    </MediaStreamProvider>
  );
}
