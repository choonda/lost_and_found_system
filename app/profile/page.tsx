"use client";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import UserProfile from "../component/Form/UserProfile";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import Link from "next/link";

const user = {
  username: "User123",
  email: "User123@gmail.com",
};

const handleSave = (newUsername: string, newEmail: string) => {
  console.log("Updated data:", newUsername, newEmail);
};

const ProfilePage = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };
  return (
    <div className="min-h-screen w-full bg-lightgreen flex flex-col gap-12 p-8">
      <div className="flex flex-row justify-between">
        <Link href="/home">
          <AiOutlineArrowLeft className="text-[#969DA3] w-8 h-8 font-semibold cursor-pointer" />
        </Link>
        <h1 className="text-2xl text-[#969DA3] ml-28">PROFILE</h1>
        <div
          className="flex gap-2 items-center cursor-pointer "
          onClick={handleSignOut}
        >
          <BiLogOut className="w-8 h-8 text-red-500" />
          <p className="text-2xl text-red-500">LOGOUT</p>
        </div>
      </div>
      <div className="flex flex-row gap-4 p-4">
        <div className="w-[50%] items-center flex flex-col gap-4  ">
          <VscAccount className="w-30 h-30 text-primarygreen bg-white rounded-full" />
          <div className="w-full">
            <UserProfile
              username={user.username}
              email={user.email}
              onSave={handleSave}
            />
          </div>
        </div>
        <div className="bg-black w-[50%] ">test</div>
      </div>
    </div>
  );
};

export default ProfilePage;
