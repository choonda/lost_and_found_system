import React from "react";
import ItemCard from "./Cards/ItemCard";

const ItemList = () => {
  return (
    <div className="flex flex-wrap gap-15 p-8 items-center justify-between">
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
