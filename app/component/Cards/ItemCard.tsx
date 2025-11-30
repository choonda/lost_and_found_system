import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { VscLocation } from "react-icons/vsc";
import ItemModal from "../ItemModal";

const role: "admin" | "user" = "admin";
type ItemCardProps = {
  id: string;
  type: string;
  itemName: string;
  location: string;
  date: string;
  photoURL: string;
  onDelete: (id: string) => void;
};
const ItemCard = ({
  id,
  type,
  itemName,
  location,
  date,
  photoURL,
  onDelete,
}: ItemCardProps) => {
  const [openItem, setOpenItem] = useState(false);
  return (
    <>
      <div className="w-full sm:w-[30%] h-fit bg-[#EBECF1] rounded-lg shadow-md">
        {/* UPPER */}

        <div className="relative" onClick={() => setOpenItem(true)}>
          {/* PHOTO */}
          <div>
            <Image
              src={
                photoURL ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/No_Image_%282879926%29_-_The_Noun_Project.svg/640px-No_Image_%282879926%29_-_The_Noun_Project.svg.png"
              }
              alt="lost item"
              width={100}
              height={100}
              className="rounded-lg w-full object-cover h-64 "
            />
            <div className="absolute bottom-2 left-2 bg-white px-4 py-1 rounded-full text-black font-semibold shadow z-40">
              {type}
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div
          className="flex w-full items-center px-3 py-2 
             flex-col gap-4 
             sm:flex-row sm:justify-between"
        >
          <span className="text-[#808080] text-xl w-full">{itemName}</span>

          <div className="w-full justify-start flex flex-col gap-1 sm:flex-row sm:justify-end">
            <div className="flex items-center gap-1">
              <AiOutlineCalendar className="w-5 h-5 text-[#1A8A94]" />
              <span className="text-[#808080] text-sm">{date}</span>
            </div>

            <div className="flex items-center gap-1">
              <VscLocation className="w-5 h-5 text-red-500" />
              <span className="text-[#808080] text-sm truncate max-w-[100px] sm:max-w-[150px]">
                {location}
              </span>
            </div>
          </div>
          {role === "admin" && (
            <div className="p-2 bg-buttongreen rounded-full text-white font-semibold hover:bg-[#006557] cursor-pointer">
              <button className="cursor-pointer" onClick={() => onDelete(id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {openItem && (
        <ItemModal
          type={type}
          itemName={itemName}
          location={location}
          date={date}
          photoURL={photoURL}
          onClose={() => setOpenItem(false)}
        />
      )}
    </>
  );
};

export default ItemCard;
