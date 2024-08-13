/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { MdMenu, MdClose } from "react-icons/md";

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Navbar position="static" maxWidth={"full"} className="bg-white px-4 py-6">
      <NavbarBrand>
        <img src="/tm-logo.png" alt="logo" className="w-10" />
      </NavbarBrand>
      <NavbarContent>
        <div className="absolute right-3 sm:hidden">
          <Button
            auto
            flat
            onClick={toggleMenu}
            className="text-white bg-violet-800 hover:bg-violet-950 rounded-md"
          >
            {showMenu ? <MdClose size={24} /> : <MdMenu size={24} />}
          </Button>
        </div>
        <div
          className={`${
            showMenu ? "block" : "hidden"
          } sm:hidden bg-[#F6F6F6] rounded-xl w-full z-10 absolute top-20 left-0 flex flex-col gap-4 p-6 font-light text-black`}
        >
          <NavbarItem>
            <Link className="text-black" href="#">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-black" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-black" href="#">
              FAQ
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-[#5013AF]" href="/search">
              Start Exploring
            </Link>
          </NavbarItem>
        </div>
        <NavbarContent
          className="hidden sm:flex gap-8 font-light text-black"
          justify="end"
        >
          <NavbarItem>
            <Link className="text-[#5013AF]" href="#">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-black" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-black" href="#">
              FAQ
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="#"
              size="lg"
              radius="sm"
              className="bg-[#5013AF] text-white"
            >
              Start Exploring
            </Button>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
}
