import React, { ReactNode } from "react";

type SubmitCardProps = {
  icon: ReactNode;
  title: string;
};
const SubmitCard = ({ icon, title }: SubmitCardProps) => {
  return (
    <div className="bg-white px-16 py-12 rounded-2xl shadow-lg items-center flex flex-col gap-2">
      <span>{icon}</span>
      <p className="text-black text-3xl font-bold">{title}</p>
    </div>
  );
};

export default SubmitCard;
