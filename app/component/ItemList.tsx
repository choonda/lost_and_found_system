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
  user: {
    name: string;
    id: string;
  };
};

const ItemList = ({
  type,
  time = "All",
  search,
}: {
  type: "Lost" | "Found" | "All" | "Role";
  time?: "1 day" | "1 week" | "1 month" | "All";
  search?: string;
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const params = new URLSearchParams();

      if (type != "All") params.append("type", type);
      if (time != "All") params.append("time", time);

      const url = `/api/items?${params.toString()}`;
      console.log("Fetching:", url);

      const response = await fetch(url);
      const data = await response.json();
      setItems(data);
      console.log("Fetched items:", data);
    };

    console.log("Fetching items of type:", type);
    fetchItems();
  }, [type, time]);

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delele this item?")) {
      return;
    }

    try {
      const res = await fetch(`/api/items?itemId=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((items) => items.id !== id));
        setDeleteMessage("Item deleted successfully!");
        setTimeout(() => setDeleteMessage(null), 2000);
      } else {
        alert("Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <>
      <div className="flex flex-wrap gap-8 p-8 ml-4  items-center w-full justify-left">
        {filtered.map((item) => {
          return (
            <ItemCard
              key={item.id}
              id={item.id}
              type={item.type}
              name={item.user.name}
              userId={item.user.id}
              itemName={item.name}
              location={item.location || ""}
              photoURL={item.imageUrl}
              description={item.description || ""}
              date={
                item.createdAt
                  ? format(new Date(item.createdAt), "dd/MM HH:mm")
                  : ""
              }
              onDelete={deleteItem}
            />
          );
        })}
      </div>
      {deleteMessage && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-buttongreen text-white px-4 py-2 rounded shadow-md z-50"
        >
          {deleteMessage}
        </div>
      )}
    </>
  );
};

export default ItemList;
