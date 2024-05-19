/* eslint-disable @next/next/no-img-element */
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export default function NavBar() {
  return (
    <Navbar position="static" maxWidth={'full'} className="bg-white px-4 py-6">
      <NavbarBrand>
        <img src="/tm-logo.png" alt="logo" className="w-10" />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-8 font-light text-black" justify="end">
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
          <Button as={Link} href="#" size="lg" radius="sm" className="bg-[#5013AF] text-white">
            Start Exploring
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
