"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

export default function ClientProvider({ children }) {
  return (
      <SessionProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </SessionProvider>
  );
}