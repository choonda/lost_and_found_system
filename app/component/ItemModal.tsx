import Image from "next/image";
import React from "react";
import { AiOutlineCalendar, AiOutlineClose } from "react-icons/ai";
import { VscLocation } from "react-icons/vsc";

type ItemModalProps = {
  type: string;
  itemName: string;
  location: string;
  date: string;
  photoURL: string;
  onClose: () => void;
};

const ItemModal = ({
  type,
  itemName,
  location,
  date,
  photoURL,
  onClose,
}: ItemModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#EBECF1] w-fit max-w-xl h-fit p-6 rounded-lg shadow-lg relative flex flex-col">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="flex text-gray-500 text-2xl font-bold hover:text-black z-50"
          >
            <AiOutlineClose className="text-gray-500 text-2xl font-bold hover:text-black" />
          </button>
        </div>

        {/* ITEM IMAGE */}
        <div className="relative w-full h-120 mb-4">
          <Image
            src={
              photoURL ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/No_Image_%282879926%29_-_The_Noun_Project.svg/640px-No_Image_%282879926%29_-_The_Noun_Project.svg.png"
            }
            alt={itemName}
            fill
            className="h-fit w-full object-fill rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-white px-4 py-1 rounded-full text-black font-semibold shadow">
            {type}
          </div>
        </div>

        {/* ITEM DETAILS */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-800">{itemName}</h2>
          <div className="flex items-center gap-2">
            <AiOutlineCalendar className="w-5 h-5 text-[#1A8A94]" />
            <span className="text-gray-600">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <VscLocation className="w-5 h-5 text-red-500" />
            <span className="text-gray-600">{location}</span>
          </div>
        </div>

        <div className="mt-4 text-gray-700">
          <p>
            Description of the item goes here. You can expand this section with
            more info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
