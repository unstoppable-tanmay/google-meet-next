"use client";

import Home from "@/components/Home";
import { joined } from "@/state/atom";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Page() {
  const [join, setJoin] = useRecoilState(joined);

  useEffect(() => {
    setJoin("joining");
  }, [setJoin]);

  return (
    <main className="min-h-screen flex flex-col relative no-scrollbar">
      {JSON.parse(process.env.NEXT_PUBLIC_PROBLEM!) && (
        <div className="problem w-full h-full absolute bg-black/50 flex items-center justify-center z-[3000] text-2xl text-white font-semibold">
          There Is Some Error Occured In Server, <br /> Fixing🛠️..., it will
          Live soon 🙃
        </div>
      )}
      <Home />
    </main>
  );
}
