"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { VscLocation } from "react-icons/vsc";
import ItemModal from "../ItemModal";

// detect whether current logged-in user is admin
const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/user/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data) return;
        setIsAdmin(data.role === "ADMIN");
      })
      .catch(() => setIsAdmin(false));

    return () => {
      mounted = false;
    };
  }, []);

  return isAdmin;
};

type ItemCardProps = {
  id: string;
  userId: string;
  type: string;
  status: "CLAIMED" | "LOOKING" | "FOUND";
  name: string;
  itemName: string;
  location: string;
  date: string;
  photoURL: string;
  description: string;
  onDelete: (id: string) => void;
};
const ItemCard = ({
  id,
  userId,
  type,
  status,
  name,
  itemName,
  location,
  date,
  photoURL,
  description,
  onDelete,
}: ItemCardProps) => {
  const [openItem, setOpenItem] = useState(false);
  const isAdmin = useIsAdmin();

  return (
    <>
      <div
        className={`w-full sm:w-[31%] h-fit bg-[#EBECF1] rounded-lg shadow-md ${
          status === "CLAIMED" ? "ring-4 ring-green-500" : ""
        }`}
      >
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
          {isAdmin && (
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
          userId={userId}
          itemId={id}
          username={name}
          type={type}
          itemName={itemName}
          location={location}
          date={date}
          photoURL={photoURL}
          description={description}
          onClose={() => setOpenItem(false)}
        />
      )}
    </>
  );
};

export default ItemCard;
