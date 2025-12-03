"use client";
import React, { useEffect, useState } from "react";
import Header from "../component/header";
import OverviewChart from "../component/OverviewChart";
import Table from "../component/Table";

type ChartDataItem = { name: string; value: number; fill: string };

export default function AdminClient() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [lostData, setLostData] = useState<ChartDataItem[]>([]);
  const [foundData, setFoundData] = useState<ChartDataItem[]>([]);
  const [totalLost, setTotalLost] = useState<number>(0);
  const [totalFound, setTotalFound] = useState<number>(0);

  // Fetch users
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
    // fetch admin stats for charts
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.warn("failed to fetch admin stats", res.status, txt);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setLostData(data.lost ?? []);
        setFoundData(data.found ?? []);
        setTotalLost(data.totalLost ?? 0);
        setTotalFound(data.totalFound ?? 0);
      })
      .catch((err) => console.error("Failed to fetch admin stats:", err));
  }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delele this user?")) {
      return;
    }
    try {
      const res = await fetch(`/api/user?userId=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((users) => users.id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-lightgreen flex flex-col gap-4 px-4 py-2">
      <Header onSearch={setSearchValue} />

      <div className="flex flex-1 gap-4 px-4 min-h-[300px]">
        <div className="bg-[#FAFCFD] rounded-2xl flex-1 ">
          <OverviewChart
            title="Lost Overview"
            data={lostData}
            totalCount={totalLost}
          />
        </div>
        <div className="bg-[#FAFCFD] rounded-2xl flex-1">
          <OverviewChart
            title="Found Overview"
            data={foundData}
            totalCount={totalFound}
          />
        </div>
      </div>

      <div className="flex-1 bg-[#FAFCFD] rounded-2xl p-4 mx-4 relative">
        <Table data={filteredUsers} onDelete={deleteUser} />
      </div>
    </div>
  );
}
