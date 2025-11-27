"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";

const Header = () => {
  return (
    <div
      className="
  flex flex-wrap 
  py-6 px-4 
  gap-4 md:gap-16 
  border-b border-[#C6D9DB] shadow-md shadow-gray-300 
  w-full h-fit items-center justify-center

"
    >
      {/* ICON */}
      <Link href="/home">
        <div className=" items-center gap-2 sm:flex sm:flex-none">
          <Image src="/0nce.png" alt="logo" width={50} height={50} />
          <div className="font-semibold text-4xl flex flex-row">
            <h1 className="text-primarygreen">0</h1>
            <h1 className="text-primarygreen/50">nce</h1>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-row items-center gap-4 md:gap-16 justify-between w-full">
        {/* SEARCH BAR */}
        <div className="flex flex-1 min-w-0 md:w-[50%] w-full">
          <div className="flex items-center w-full bg-white rounded-full pl-4 shadow-md border-primarygreen border-2">
            <AiOutlineSearch className="w-8 h-8 text-primarygreen flex-none" />
            <input
              className="flex-1 min-w-0 focus:outline-none placeholder-gray-400 text-base"
              type="text"
              placeholder="Find something..."
            />
            <button className="bg-buttongreen rounded-full py-2 px-5 flex-none hover:bg-[#006557] cursor-pointer">
              <p className="font-semibold text-white">Search</p>
            </button>
          </div>
        </div>

        {/* USER */}
        <Link href="/profile" className="flex items-center gap-2 ">
          <button className="flex-none cursor-pointer">
            <VscAccount className="w-10 h-10 text-primarygreen bg-white rounded-full" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
