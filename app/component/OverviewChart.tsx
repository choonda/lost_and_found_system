"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

type ChartDataItem = { name: string; value: number; fill: string };
type OverviewChartProps = {
  title: string;
  data: ChartDataItem[];
  isAnimationActive?: boolean;
  totalCount: number;
};
const OverviewChart = ({
  title,
  data,
  isAnimationActive = true,
  totalCount,
}: OverviewChartProps) => {
  return (
    <div className="w-full h-full flex flex-col px-2 py-4">
      <p className="text-xl font-semibold mb-2 text-black">{title}</p>

      <div className="flex-1 relative">
        {/* Center number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex">
          <span className="font-bold text-3xl text-black">{totalCount}</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={10}
              isAnimationActive={isAnimationActive}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
