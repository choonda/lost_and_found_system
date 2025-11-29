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
  totalCount = 120,
}: OverviewChartProps) => {
  return (
    <div className="w-full h-full flex flex-col px-2 py-4">
      <p className="text-xl font-semibold mb-2">{title}</p>

      <div className="flex-1 h-full w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={5}
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
              iconSize={12}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="font-bold text-3xl">{totalCount}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
