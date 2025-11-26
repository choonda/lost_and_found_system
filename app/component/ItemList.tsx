import React from "react";
import ItemCard from "./Cards/ItemCard";

const ItemDataSample = [
  {
    id: 1,
    type: "Lost",
    name: "Earphones",
    date: "11/11/25",
    location: "Mpk5",
    photoUrl: "/Lost_sample.png",
  },
  {
    id: 2,
    type: "Found",
    name: "Wallet",
    date: "15/11/25",
    location: "Library",
    photoUrl: "/Lost_sample.png",
  },
  {
    id: 3,
    type: "Lost",
    name: "Umbrella",
    date: "10/11/25",
    location: "Cafeteria",
    photoUrl: "/Lost_sample.png",
  },
  {
    id: 4,
    type: "Found",
    name: "Laptop",
    date: "12/11/25",
    location: "Lecture Hall",
    photoUrl: "/Lost_sample.png",
  },
  {
    id: 5,
    type: "Lost",
    name: "Backpack",
    date: "09/11/25",
    location: "Parking Lot",
    photoUrl: "/Lost_sample.png",
  },
  {
    id: 6,
    type: "Found",
    name: "Keys",
    date: "13/11/25",
    location: "Gym",
    photoUrl: "/Lost_sample.png",
  },
  {
    id: 7,
    type: "Lost",
    name: "Sunglasses",
    date: "08/11/25",
    location: "Canteen",
    photoUrl: "/Lost_sample.png",
  },
];
const ItemList = () => {
  return (
    <div className="flex flex-wrap gap-15 p-8 items-center justify-between">
      {ItemDataSample.map((item) => (
        <ItemCard
          key={item.id}
          type={item.type}
          itemName={item.name}
          date={item.date}
          location={item.location}
          photoURL={item.photoUrl}
        />
      ))}
    </div>
  );
};

export default ItemList;
