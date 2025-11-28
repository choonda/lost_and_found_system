"use client";
import Link from "next/link";
import React, { useState } from "react";
import { VscAdd, VscMap } from "react-icons/vsc";

const Filter = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDay, setSelectedDay] = useState("1 Day");
  const types = ["All", "Lost", "Found"];
  const days = ["1 Day", "1 Week", "1 Month"];

  return (
    <div className="w-full h-fit flex flex-wrap justify-between items-center gap-6 p-6">
      {/* LEFT FILTER GROUP */}
      <div className="flex flex-wrap gap-6">
        {/* LOST/FOUND TYPE */}
        <div className="bg-white rounded-lg px-4 py-3">
          <div className="text-primarygreen flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === type
                    ? "bg-[#1A8A94] font-bold text-white shadow-lg underline"
                    : ""
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* DAY FILTER */}
        <div className="bg-white rounded-lg px-4 py-3">
          <div className="text-primarygreen flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                className={`px-4 py-2 rounded-lg ${
                  selectedDay === day
                    ? "bg-[#1A8A94] font-bold text-white shadow-lg underline"
                    : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex flex-wrap gap-6">
        {/* ADD BUTTON */}
        <Link
          href="/lostfound"
          className="flex flex-row gap-3 items-center bg-buttongreen rounded-full hover:bg-[#006557] cursor-pointer py-3 px-6"
        >
          <p className="text-white font-bold text-xl">Add</p>
          <VscAdd className="text-white font-extrabold w-7 h-7" />
        </Link>

        {/* MAP BUTTON */}
        <Link href="/map">
          <button className="flex flex-row gap-3 items-center bg-buttongreen rounded-full hover:bg-[#006557] cursor-pointer py-3 px-6">
            <p className="text-white font-bold text-xl">Map</p>
            <VscMap className="text-white font-extrabold w-7 h-7" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Filter;
