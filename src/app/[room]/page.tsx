"use client";

import JoinRoom from "@/components/room/JoinRoom";
import JoinedRoom from "@/components/room/JoinedRoom";
import { generateRoomId, isValidRoomId } from "@/lib/room-id";
import { joined } from "@/state/atom";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Page = ({ params }: { params: { room: string } }) => {
  const room = params.room;
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const [join, setJoin] = useRecoilState(joined);

  useEffect(() => {
    console.log(generateRoomId());
    if (!isValidRoomId(room)) {
      setLoadingMessage("Invalid Room Code");
      router.replace("/");
    } else {
      setPageLoading(false);
    }

    return () => {
      setJoin(false);
    };
  }, [room, router, setJoin]);

  return pageLoading ? (
    <section className="w-screen h-screen flex items-center justify-center">
      {loadingMessage}
    </section>
  ) : join ? (
    <JoinedRoom />
  ) : (
    <JoinRoom setJoin={setJoin} />
  );
};

export default Page;
