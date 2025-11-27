import Image from "next/image";
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { VscLocation } from "react-icons/vsc";

type ItemCardProps = {
  type: string;
  itemName: string;
  location: string;
  date: string;
  photoURL: string;
};
const ItemCard = ({
  type,
  itemName,
  location,
  date,
  photoURL,
}: ItemCardProps) => {
  return (
    <div className="w-[30%] h-fit bg-[#EBECF1] rounded-lg shadow-md">
      {/* UPPER */}
      <div className="relative">
        {/* PHOTO */}
        <div>
          <Image
            src={photoURL ||  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/No_Image_%282879926%29_-_The_Noun_Project.svg/640px-No_Image_%282879926%29_-_The_Noun_Project.svg.png"}
            alt="lost item"
            width={200}
            height={200}
            className="rounded-lg w-full h-fit"
          />
          <div className="absolute bottom-2 left-2 bg-white px-4 py-1 rounded-full text-black font-semibold shadow z-40">
            {type}
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-row w-full h-fit items-center px-3 py-2 justify-between">
        <span className="text-[#808080] text-xl">{itemName}</span>
        <div className="flex flex-row gap-2">
          <div className="flex items-center gap-1">
            <AiOutlineCalendar className="w-4 h-4 text-[#1A8A94]" />
            <span className="text-[#808080] text-md">{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <VscLocation className="w-5 h-5 text-red-500 " />
            <span className="text-[#808080] text-md">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
