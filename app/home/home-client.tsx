"use client";
import React, { useState } from "react";
import Header from "../component/header";
import Filter from "../component/filter";
import ItemList from "../component/ItemList";

export default function HomeClientPage() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="min-h-screen w-full bg-lightgreen">
      <div className="sticky top-0 z-50 left-0 right-0 bg-lightgreen">
        <Header onSearch={setSearchValue} />
      </div>
      <div>
        <Filter />
      </div>
      <div className="">
        <ItemList type="Found" search={searchValue} />
      </div>
    </div>
  );
}
