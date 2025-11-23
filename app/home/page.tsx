import React from "react";
import Header from "../component/header";
import Filter from "../component/filter";

const page = () => {
  return (
    <div className="h-screen w-screen bg-lightgreen">
      <div>
        <Header />
      </div>
      <div>
        <Filter />
      </div>
      <div></div>
    </div>
  );
};

export default page;
