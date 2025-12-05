import React, { useEffect, useState } from "react";

type Props = {
  username: string;
  email: string;
  image?: string;
  onProfileUpdated: (user: any) => void;
};

export default function UserProfile({
  username: initialUsername,
  email,
  image,
  onProfileUpdated,
}: Props) {
  const [username, setUsername] = useState(initialUsername ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log(
      "USERPROFILE: initialUsername prop changed ->",
      initialUsername
    );
    setUsername(initialUsername ?? "");
  }, [initialUsername]);

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("name", username);
    if (photoFile) formData.append("photo", photoFile);

    const res = await fetch("/api/user/me", {
      method: "PATCH",
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      console.log("UpdatedUser from server", updated);
      onProfileUpdated(updated); // update UI in parent page
    } else {
      console.error("Failed to update profile");
      setSaving(false);
    }
  };

  return (
    <div className="items-center flex flex-col gap-6 w-full">
      {/* Upload Photo */}
      <label className="flex flex-col items-center cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
        />
        {photoFile ? (
          <img
            src={URL.createObjectURL(photoFile)}
            className="w-32 h-32 rounded-full object-cover border-3"
          />
        ) : (
          <img
            src={image || "/default.png"}
            className="w-32 h-32 rounded-full object-cover border-3"
          />
        )}
      </label>

      {/* Username */}
      <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-2 w-full ">
        <label className="text-black font-bold">Username</label>
        <input
          type="text"
          value={username}
          className="placeholder-text-black placeholder-font-light bg-[#E6F6F4] p-3 rounded-md outline-none dark:text-black"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Email - READ ONLY */}
      <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-2 w-full dark:text-black">
        <label className="text-[#969DA3] font-bold">Email</label>
        <input
          type="text"
          value={email}
          readOnly
          className="bg-[#E6F6F4] p-3 rounded-md outline-none opacity-70"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-buttongreen px-8 py-4 rounded-full text-white text-xl hover:bg-[#006557]"
      >
        Save
      </button>
    </div>
  );
}
