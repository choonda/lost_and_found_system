import React, { useState } from "react";

type UserProfileProps = {
  username: string;
  email: string;
  onSave: (username: string, email: string) => void;
};

const UserProfile = ({
  username: initialUserName,
  email: initialEmail,
  onSave,
}: UserProfileProps) => {
  const [username, setUsername] = useState(initialUserName);
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    onSave(username, email);
  };
  return (
    <div className="items-center flex flex-col gap-4">
      <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-4 w-full">
        <label className="text-[#969DA3] px-2 text-md font-bold">
          Username
        </label>
        <div className="bg-[#E6F6F4] p-4 rounded-md flex flex-col gap-2">
          <input
            type="text"
            placeholder={username}
            className="placeholder-text-[#808080] placeholder-font-light outline-none bg-transparent"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-4 w-full">
        <label className="text-[#969DA3] px-2 text-md font-bold">
          Email Address
        </label>
        <div className="bg-[#E6F6F4] p-4 rounded-md flex flex-col gap-2">
          <input
            type="text"
            placeholder={email}
            className="placeholder-text-[#808080] placeholder-font-light outline-none bg-transparent"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-buttongreen px-8 py-4 rounded-full items-center flex cursor-pointer hover:bg-[#006557]">
        <button
          className="outline-none text-white text-xl cursor-pointer"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
