"use client";
import Image from "next/image";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";

const Header = () => {
  return (
<<<<<<< HEAD
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
      <div className=" items-center gap-2 sm:flex sm:flex-none">
        <Image src="/0nce.png" alt="logo" width={50} height={50} />
        <div className="font-semibold text-4xl flex flex-row">
=======
    <div className="flex flex-row py-8 px-4 gap-20 border-b-[#C6D9DB] shadow-md shadow-gray-300 w-full h-fit items-center justify-between">
      {/* ICON */}
      <div className="flex flex-row h-fit items-center">
        <div>
          <Image src="/0nce.png" alt="logo" width={55} height={55} />
        </div>
        <div className="font-semibold text-5xl flex flex-row">
>>>>>>> 85c30d91ae36695f171eefaff84b460f9150f9dc
          <h1 className="text-primarygreen">0</h1>
          <h1 className="text-primarygreen/50">nce</h1>
        </div>
      </div>
<<<<<<< HEAD

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
        <button className="flex-none">
=======
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
>>>>>>> 85c30d91ae36695f171eefaff84b460f9150f9dc
          <VscAccount className="w-10 h-10 text-primarygreen bg-white rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default Header;
