"use client";
import React, { useEffect, useState } from "react";
import Header from "../component/header";
import OverviewChart from "../component/OverviewChart";
import Table from "../component/Table";

const Lostdata = [
  { name: "Pending", value: 400, fill: "#0088FE" },
  { name: "Success", value: 200, fill: "#00C49F" },
];
const Founddata = [
  { name: "Pending", value: 300, fill: "#FFBB28" },
  { name: "Success", value: 500, fill: "#FF8042" },
];

const AdminPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<{ name: string; email: string }[]>([]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <div className="min-h-screen w-full bg-lightgreen flex flex-col gap-4 p-4">
      <div>
        <Header onSearch={setSearchValue} />
      </div>
      <div className="flex flex-1 gap-4 px-4 min-h-[300px]">
        <div className="bg-[#FAFCFD] rounded-2xl flex-1 ">
          <OverviewChart
            title="Lost Item Overview"
            data={Lostdata}
            totalCount={120}
          />
        </div>
        <div className="bg-[#FAFCFD] rounded-2xl flex-1">
          <OverviewChart
            title="Found Item Overview"
            data={Founddata}
            totalCount={150}
          />
        </div>
      </div>
      <div className="flex-1 bg-[#FAFCFD] rounded-2xl p-4 mx-4">
        <Table data={filteredUsers} />
      </div>
    </div>
  );
};

export default AdminPage;
