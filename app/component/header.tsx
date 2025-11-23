"use client";
import Image from "next/image";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";

const Header = () => {
  return (
    <div className="flex flex-row p-8 gap-20 border-b-[#C6D9DB] shadow-md shadow-gray-300 w-full h-fit items-center justify-between">
      {/* ICON */}
      <div className="flex flex-row h-fit items-center">
        <div>
          <Image src="/0nce.png" alt="logo" width={55} height={55} />
        </div>
        <div className="font-semibold text-5xl flex flex-row">
          <h1 className="text-primarygreen">0</h1>
          <h1 className="text-primarygreen/50">nce</h1>
        </div>
      </div>
      {/* SEARCH BAR */}
      <div className=" flex flex-row h-fit w-fit">
        <div className="flex items-center  bg-white rounded-full pl-4  shadow-md border-primarygreen border-2">
          <div className="flex items-center gap-4">
            <AiOutlineSearch className="w-10 h-10 text-primarygreen " />
            <input
              className="border-primarygreen w-220 focus:outline-none placeholder-[A7A7A7] placeholder:text-lg"
              type="text"
              name="search"
              placeholder="Find something..."
            ></input>
            <button className="bg-buttongreen rounded-full py-3 px-6 hover:bg-[#006557] cursor-pointer">
              <p className="font-semibold text-white text-lg">Search</p>
            </button>
          </div>
        </div>
      </div>
      {/* USER */}
      <div className="flex flex-row gap-2 w-fit h-fit items-center">
        <button className="cursor-pointer">
          <VscAccount className="w-10 h-10 text-primarygreen bg-white rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default Header;
