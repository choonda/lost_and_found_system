import React from "react";
import ItemCard from "./Cards/ItemCard";

const ItemList = () => {
  return (
    <div className="grid grid-rows-2 grid-cols-4 gap-4 p-8 items-center justify-center">
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
    </div>
  );
};

export default ItemList;
