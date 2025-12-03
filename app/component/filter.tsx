"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { TbUserEdit } from "react-icons/tb";
import { VscAdd, VscMap } from "react-icons/vsc";
import QRScanner from "../component/QRScanner";
import { AiOutlineQrcode } from "react-icons/ai";
// fetch current user role from backend

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/user/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
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
// controlled props are supported; falls back to internal state when not provided
type FilterProps = {
  selectedType?: "All" | "Lost" | "Found";
  onTypeChange?: (t: "All" | "Lost" | "Found") => void;
  selectedTime?: "All" | "1 day" | "1 week" | "1 month";
  onTimeChange?: (t: "All" | "1 day" | "1 week" | "1 month") => void;
};

const Filter: React.FC<FilterProps> = ({
  selectedType: controlledType,
  onTypeChange,
  selectedTime: controlledTime,
  onTimeChange,
}) => {
  // fall back to internal state when used without control props
  const [internalType, setInternalType] = useState<"All" | "Lost" | "Found">(
    "All"
  );
  const [internalTime, setInternalTime] = useState<
    "All" | "1 day" | "1 week" | "1 month"
  >("All");
  const selectedType = controlledType ?? internalType;
  const setSelectedType = onTypeChange ?? setInternalType;
  const selectedTime = controlledTime ?? internalTime;
  const setSelectedDay = onTimeChange ?? setInternalTime;
  const types = ["All", "Lost", "Found"];
  // normalize days to match ItemList expected values (lowercase with spaces)
  const days = ["All", "1 day", "1 week", "1 month"];

  const isAdmin = useIsAdmin();
  const [isQRopen, setIsQRopen] = useState(false);
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
                onClick={() =>
                  setSelectedType(type as "All" | "Lost" | "Found")
                }
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
                  selectedTime === day
                    ? "bg-[#1A8A94] font-bold text-white shadow-lg underline"
                    : ""
                }`}
                onClick={() => setSelectedDay(day as any)}
              >
                {day === "All" ? "All" : day}
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
        {isAdmin && (
          <Link href="/admin">
            <button className="flex flex-row gap-3 items-center bg-buttongreen rounded-full hover:bg-[#006557] cursor-pointer py-3 px-6">
              <p className="text-white font-bold text-xl">Admin</p>
              <TbUserEdit className="text-white font-extrabold w-7 h-7" />
            </button>
          </Link>
        )}
        {isAdmin && (
          <button
            className="flex flex-row gap-3 items-center bg-buttongreen rounded-full hover:bg-[#006557] cursor-pointer py-3 px-6"
            onClick={() => setIsQRopen(true)}
          >
            <p className="text-white font-bold text-xl">QRScan</p>
            <AiOutlineQrcode className="text-white font-extrabold w-7 h-7" />
          </button>
        )}
      </div>
      {isQRopen && (
        <div>
          <QRScanner centerId={2} onClose={() => setIsQRopen(false)} />
        </div>
      )}
    </div>
  );
};

export default Filter;
