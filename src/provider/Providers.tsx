"use client";

import React, { ReactNode } from "react";

import RecoilContextProvider from "@/state/recoilContextProvider";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <RecoilContextProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </RecoilContextProvider>
    </SessionProvider>
  );
};

export default Providers;
