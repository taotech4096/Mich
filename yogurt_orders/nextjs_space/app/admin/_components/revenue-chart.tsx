"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formattedData = (data ?? []).map((item) => ({
    ...item,
    date: item?.date?.split("-").slice(1).join("/") ?? "",
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={formattedData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Ingresos"]}
          contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
