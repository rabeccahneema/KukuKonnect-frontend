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
  gradientId,
  gradientColor,
  chartHeight,
  chartBoxMinHeight,
  valueFormatter
}: ChartSectionProps) {
  return (
    <section className={`bg-white rounded-2xl shadow-lg ${chartBoxMinHeight} flex flex-col justify-center p-4 w-full`}>
      <h2 className="text-xl text-emerald-900 font-semibold mb-6 text-center">{title}</h2>
      <div className="w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 30, right: 30, left: 0, bottom: 45 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
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
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
