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
      <Home />
    </main>
  );
}
