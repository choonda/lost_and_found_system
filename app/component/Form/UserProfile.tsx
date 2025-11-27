import React from "react";

const UserProfile = () => {
  return (
    <div className="items-center flex flex-col gap-4">
      <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-4 w-full">
        <p className="text-[#969DA3] px-2 text-md font-bold">Username</p>
        <div className="bg-[#E6F6F4] p-4 rounded-md flex flex-col gap-2">
          <p className="text-[#808080] font-light">User123</p>
        </div>
      </div>
      <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-4 w-full">
        <p className="text-[#969DA3] px-2 text-md font-bold">Username</p>
        <div className="bg-[#E6F6F4] p-4 rounded-md flex flex-col gap-2">
          <p className="text-[#808080] font-light">User123</p>
        </div>
      </div>
      <div className="bg-buttongreen px-8 py-4 rounded-full items-center flex">
        <button className="outline-none text-white text-xl">Save</button>
      </div>
    </div>
  );
};

export default UserProfile;
