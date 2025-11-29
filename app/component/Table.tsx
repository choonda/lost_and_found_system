import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
type Data = {
  name: string;
  email: string;
};
type TableProps = {
  data: Data[];
};

const Table = ({ data }: TableProps) => {
  return (
    <table className="w-full">
      <thead className=" py-2 text-left">
        <tr className="">
          <th className="p-1">Name</th>
          <th className="p-1">Email</th>
          <th className="p-1">Action</th>
        </tr>
      </thead>
      <tbody className="">
        {data.map((row, index) => (
          <tr
            key={index}
            className={`odd:bg-[#E6F6F4] even:bg-[#b0e4dd] rounded-xl`}
          >
            <td className="p-1 text-[#808080]">{row.name}</td>
            <td className="p-1 text-[#808080]">{row.email}</td>
            <td className="p-1">
              <button className="text-red-500 hover:text-red-700 bg-white p-2 rounded-2xl hover:shadow-md hover:bg-gray-200 transition-shadow">
                <AiOutlineDelete size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
