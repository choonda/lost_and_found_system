import React from "react";

import { prisma } from "@/lib/prisma";
import MapComponent from "../component/MapComponent";

// Server component: fetch stations directly
const MapPage = async () => {
  const stations = await prisma.kolej.findMany({
    select: { id: true, name: true, location: true },
  });

  return (
    <div className="h-screen w-full">
      <MapComponent stations={stations} />
    </div>
  );
};

export default MapPage;
