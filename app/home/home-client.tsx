"use client";
import React from "react";
import Header from "../component/header";
import Filter from "../component/filter";
import ItemList from "../component/ItemList";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";

export default function HomeClientPage() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/auth");
    };

    return (
        <div className="min-h-screen w-screen bg-lightgreen">
            <div className="sticky top-0 z-50 left-0 right-0 bg-lightgreen">
                <Header />
                <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >Sign Out</button>
            </div>
            <div>
                <Filter />
            </div>
            <div>
                <ItemList />
            </div>
        </div>
    )
}
