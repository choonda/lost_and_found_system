"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import UserProfile from "../component/Form/UserProfile";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import Link from "next/link";
import ItemList from "../component/ItemList";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>();

async function loadUser() {
    const res = await fetch("/api/user/me");
    const data = await res.json();
        console.log("user data:", data);
    setUser(data);
  }

  useEffect(() => {
    loadUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>  
    );

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
      <div className="flex flex-col gap-4 p-4">
        <div className="w-full items-center flex flex-col gap-4  ">
          
          <div className="w-full">
            <UserProfile
              username={user.name}
              email={user.email}
              image={user.image}
              onProfileUpdated={(updated) => setUser(updated)}
            />
          </div>
        </div>
      </div>
      <div className="">
        <p className="text-[#969DA3] text-xl underline flex px-4">Your Post</p>
        <ItemList type="Role" />
      </div>
    </div>
  );
};

export default ProfilePage;
