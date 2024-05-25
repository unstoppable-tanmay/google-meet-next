"use client";

import { generateRoomId, isValidRoomId } from "@/lib/room-id";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { room: string } }) => {
  const room = params.room;
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  useEffect(() => {
    console.log(generateRoomId());
    if (!isValidRoomId(room)) {
      setLoadingMessage("Invalid Room Code");
      router.replace("/");
    } else {
      setPageLoading(false);
    }
  }, [room, router]);
  return pageLoading ? (
    <section className="w-screen h-screen flex items-center justify-center">
      {loadingMessage}
    </section>
  ) : (
    <section className="">{room}</section>
  );
};

export default Page;
