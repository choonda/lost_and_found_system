import React from "react";

import { prisma } from "@/lib/prisma";
import MapComponent from "../component/MapComponent";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";

const MapPage = async () => {
  const stations = await prisma.center.findMany({
    select: { id: true, longitude: true, latitude: true },
  });

  const validStations = stations.filter(
    (station) => station.longitude !== null && station.latitude !== null
  ) as Array<{ id: number; name: string; longitude: number; latitude: number }>;
  console.log("Station:", validStations);
  return (
    <div className="h-screen w-full flex flex-col">
      <MapComponent stations={validStations} />
    </div>
  );
};

export default MapPage;
