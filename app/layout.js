import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Talentmapp People Search - Find YOUR People",
  description: "Bridge the gap between talent and opportunity, and find YOUR people",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </UserProvider>
  );
}
