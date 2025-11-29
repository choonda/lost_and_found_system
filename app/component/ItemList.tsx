"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "./Cards/ItemCard";

type Item = {
  id: number;
  type: "Lost" | "Found";
  title: string;
  lostLocation?: string;
  foundLocation?: string;
  lostDate?: string;
  foundDate?: string;
  imageURL: string;
};

const ItemList = ({
  type,
  search,
}: {
  type: "Lost" | "Found";
  search: string;
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const apiEndpoint = type === "Lost" ? "/api/lost-items" : "api/found-items";

  useEffect(() => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched items:", data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedItems = data.map((item: any) => ({
          id: item.id,
          type: type,
          title: item.title,
          lostLocation: item.lostLocation,
          foundLocation: item.foundLocation,
          lostDate: item.createdAt,
          foundDate: item.createdAt,
          imageURL: item.imageUrl,
        }));
        setItems(mappedItems);
      })
      .catch((err) => console.error("Failed to fetch items:", err));
  }, [apiEndpoint, type]);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes((search || "").toLowerCase())
  );
  return (
    <div className="flex flex-wrap gap-15 p-8 items-center">
      {filtered.map((item) => (
        <ItemCard
          key={item.id}
          type={item.type}
          itemName={item.title}
          date={item.lostDate || item.foundDate || ""}
          location={item.lostLocation || item.foundLocation || ""}
          photoURL={item.imageURL}
        />
      ))}
    </div>
  );
};

export default ItemList;
