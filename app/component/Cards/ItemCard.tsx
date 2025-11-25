import Image from "next/image";
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { VscLocation } from "react-icons/vsc";

const ItemCard = () => {
  return (
    <div className="w-[30%] h-fit bg-[#EBECF1] rounded-lg shadow-md">
      {/* UPPER */}
      <div className="relative">
        {/* PHOTO */}
        <div>
          <Image
            src="/Lost_sample.png"
            alt="lost item"
            width={200}
            height={200}
            className="rounded-lg w-full h-fit"
          />
          <div className="absolute bottom-2 left-2 bg-white px-4 py-1 rounded-full text-black font-semibold shadow z-40">
            Lost
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-row w-full h-fit items-center px-3 py-2 justify-between">
        <span className="text-[#808080] text-xl">Earphone</span>
        <div className="flex flex-row gap-2">
          <div className="flex items-center gap-1">
            <AiOutlineCalendar className="w-4 h-4 text-[#1A8A94]" />
            <span className="text-[#808080] text-md">11/11/25</span>
          </div>
          <div className="flex items-center gap-1">
            <VscLocation className="w-5 h-5 text-red-500 " />
            <span className="text-[#808080] text-md">Mpk5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
