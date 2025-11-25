import React from "react";
import SubmitCard from "../component/Cards/SubmitCard";
import { BiSearchAlt } from "react-icons/bi";
import { TiShoppingBag } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen min-w-screen bg-lightgreen flex flex-col items-center justify-center gap-12 p-8">
      <div className="flex flex-col gap-8">
        <Link href="/lostfound/submit_lost">
          <SubmitCard
            icon={<BiSearchAlt className="text-black w-20 h-20" />}
            title="Find"
          />
        </Link>
        <Link href="/lostfound/submit_found">
          <SubmitCard
            icon={<TiShoppingBag className="text-black w-20 h-20" />}
            title="Report"
          />
        </Link>
      </div>
      <Link href="/home">
        <div className="p-8 bg-white rounded-full">
          <AiOutlineClose className="text-5xl font-bold" />
        </div>
      </Link>
    </div>
  );
};

export default page;
