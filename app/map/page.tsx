import React from "react";

import { prisma } from "@/lib/prisma";
import MapComponent from "../component/MapComponent";

const MapPage = async () => {
  const stations = await prisma.center.findMany({
    select: { id: true, name: true, longitude: true, latitude: true },
  });

  const validStations = stations.filter(
    (station) => station.longitude !== null && station.latitude !== null
  ) as Array<{ id: number; name: string; longitude: number; latitude: number }>;
  console.log("Station:", validStations);
  return (
    <div className="h-screen w-full">
      <MapComponent stations={validStations} />
    </div>
  );
};

export default MapPage;
