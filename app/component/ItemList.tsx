"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "./Cards/ItemCard";

import { format } from "date-fns";

type Item = {
  id: string;
  type: "Lost" | "Found" | "All";
  name: string;
  location?: string;
  description?: string;
  date?: Date;
  imageUrl: string;
  status: "LOOKING" | "FOUND" | "CLAIMED";
  createdAt: Date;
};

const ItemList = ({
  type,
  search,
}: {
  type: "Lost" | "Found" | "All" | "Role";
  search?: string;
}) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      let url = "/api/items";
      if (type !== "All") {
        url += `?type=${type}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setItems(data);
      console.log("Fetched items:", data);
    };

    console.log("Fetching items of type:", type);
    fetchItems();
  }, [type]);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-15 p-8 items-center">
      {filtered.map((item) => (
        <ItemCard
          key={item.id}
          type={item.type}
          itemName={item.name}
          location={item.location || ""}
          photoURL={item.imageUrl}
          date={
            item.createdAt
              ? format(new Date(item.createdAt), "dd/MM HH:mm")
              : ""
          }
        />
      ))}
    </div>
  );
};

export default ItemList;
