"use client";
import React, { useState } from "react";
import { VscAdd, VscMap } from "react-icons/vsc";

const Filter = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDay, setSelectedDay] = useState("1 Day");
  const types = ["All", "Lost", "Found"];
  const days = ["1 Day", "1 Week", "1 Month"];

  return (
    <div className="w-full h-fit flex flex-rol gap-20 p-8">
      <div className="flex flex-row gap-8">
        <div className="bg-white rounded-lg  px-6 py-4">
          <div className="text-primarygreen ">
            {types.map((type) => (
              <button
                key={type}
                className={`px-8 py-2 ${
                  selectedType === type
                    ? "bg-[#1A8A94] font-bold text-white shadow-lg rounded-lg underline"
                    : ""
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg  px-6 py-4">
            <div className="text-primarygreen ">
              {days.map((day) => (
                <button
                  key={day}
                  className={`px-8 py-2 ${
                    selectedDay === day
                      ? "bg-[#1A8A94] font-bold text-white shadow-lg rounded-lg underline"
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
      </div>
      <div className="flex flex-row gap-4 items-center bg-buttongreen rounded-full hover:bg-[#006557] cursor-pointer">
        <button className="flex flex-row gap-4  items-center cursor-pointer  py-3 px-6">
          <p className="text-white font-bold text-2xl">Add</p>
          <VscAdd className="text-white font-extrabold w-8 h-8" />
        </button>
      </div>
      <div className="flex flex-row gap-4 items-center bg-buttongreen rounded-full hover:bg-[#006557] cursor-pointer">
        <button className="flex flex-row gap-4  items-center cursor-pointer  py-3 px-6">
          <p className="text-white font-bold text-2xl">Map</p>
          <VscMap className="text-white font-extrabold w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Filter;
