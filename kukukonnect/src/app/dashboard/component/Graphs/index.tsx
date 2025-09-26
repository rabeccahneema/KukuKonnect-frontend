'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { ChartSectionProps } from "@/app/utils/types/graphs";

export default function ChartsSection({
  title,
  data,
  dataKey,
  yLabel,
  yDomain,
  yTicks,
  gradientColor,
  chartHeight,
  chartBoxMinHeight,
  valueFormatter
}: ChartSectionProps) {
  return (
    <section className={`bg-white rounded-2xl shadow-lg ${chartBoxMinHeight} flex flex-col justify-center p-4 w-full`}>
      <h2 className="text-xl text-emerald-900 font-semibold mb-6 text-center">{title}</h2>
      <div className="w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart
            data={data}
            margin={{ top: 30, right: 30, left: 0, bottom: 45 }}
          >
            <XAxis
              dataKey="time"
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -15,
                fill: "#1C4532",
                fontSize: 16
              }}
              tick={{ fill: "#365E59", fontSize: 12 }}
              interval={2}
              axisLine
            />
            <YAxis
              domain={yDomain}
              ticks={yTicks}
              label={{
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#1C4532",
                fontSize: 16
              }}
              tick={{ fill: "#365E59", fontSize: 12 }}
              tickFormatter={valueFormatter}
              axisLine
              tickLine
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColor}
              fill={gradientColor}
              fillOpacity={1}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}