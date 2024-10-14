import { Inter } from "next/font/google";
import ClientProvider from "./ClientProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Talentmapp People Search - Find YOUR People",
  description:
    "Bridge the gap between talent and opportunity, and find YOUR people",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-white">
      <body className={inter.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
