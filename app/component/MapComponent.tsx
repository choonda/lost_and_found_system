"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type Station = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

type MapComponentProps = {
  stations: Station[];
};

const MapComponent: React.FC<MapComponentProps> = ({ stations }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      zoom={13}
      center={userLocation || { lat: 3.139, lng: 101.6869 }} // fallback center (KL)
    >
      {/* User location marker */}
      {userLocation && <Marker position={userLocation} label="You" />}

      {/* Stations */}
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={{ lat: station.latitude, lng: station.longitude }}
          label={station.name}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
