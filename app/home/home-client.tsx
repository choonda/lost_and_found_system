"use client";
import React from "react";
import Header from "../component/header";
import Filter from "../component/filter";
import ItemList from "../component/ItemList";

export default function HomeClientPage() {
  return (
    <div className="min-h-full w-full bg-lightgreen">
      <div className="sticky top-0 z-50 left-0 right-0 bg-lightgreen">
        <Header />
      </div>
      <div>
        <Filter />
      </div>
      <div>
        <ItemList type="Lost" />
        <ItemList type="Found" />
      </div>
    </div>
  );
}
