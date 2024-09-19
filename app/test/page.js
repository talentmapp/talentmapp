// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

import Landing from "../components/landing/Landing";
import InfoSection from "../components/landing/InfoSection";
import LandingBottom from "../components/landing/LandingBottom";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Landing />
      <InfoSection />
      <LandingBottom />
    </div>
  );
}
