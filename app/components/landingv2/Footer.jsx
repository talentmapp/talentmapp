"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-14 px-24 w-full">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Left Section - Logo and Company Name */}
        <div className="mb-8 md:mb-0">
          <div className="flex items-center space-x-4">
            {/* Add your logo here */}
            <img
              src="/tm-small-logo.png"
              alt="talentmapp logo"
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold">talentmapp</span>
          </div>
        </div>

        {/* Middle Section - Use Cases */}
        <div className="flex flex-col md:flex-row w-3/4 justify-between pr-24">
          <div>
            <h3 className="text-lg font-semibold mb-4">Use cases</h3>
            <ul className="space-y-2 text-sm">
              <li>UI design</li>
              <li>UX design</li>
              <li>Wireframing</li>
              <li>Diagramming</li>
              <li>Brainstorming</li>
              <li>Online whiteboard</li>
              <li>Team collaboration</li>
            </ul>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>Design</li>
              <li>Prototyping</li>
              <li>Development features</li>
              <li>Design systems</li>
              <li>Collaboration features</li>
              <li>Design process</li>
              <li>FigJam</li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>Blog</li>
              <li>Best practices</li>
              <li>Colors</li>
              <li>Color wheel</li>
              <li>Support</li>
              <li>Developers</li>
              <li>Resource library</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
