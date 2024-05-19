import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { NextUIProvider } from "@nextui-org/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Talentmapp People Search - Find YOUR People",
  description:
    "Bridge the gap between talent and opportunity, and find YOUR people",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <NextUIProvider >
          <body className={inter.className}>{children}</body>
        </NextUIProvider>
      </html>
    </UserProvider>
  );
}
