"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { SCALE_ORDER } from "@/constants/scales";
import { ScaleResult, TCIScale } from "@/types/assessment";

interface ScoreBarChartProps {
  results: Record<TCIScale, ScaleResult>;
}

const DIMENSION_COLOR: Record<ScaleResult["dimension"], string> = {
  TEMPERAMENT: "#E5484D",
  CHARACTER: "#16161D",
};

export function ScoreBarChart({ results }: ScoreBarChartProps) {
  const data = SCALE_ORDER.map((scale) => ({
    scale,
    name: `${results[scale].scaleName} (${scale})`,
    percentage: results[scale].percentage,
    dimension: results[scale].dimension,
  }));

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-lg font-black">척도별 백분위 비교</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 0 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9A948B", fontSize: 10 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={112}
              tick={{ fill: "#16161D", fontSize: 11 }}
            />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((entry) => (
                <Cell key={entry.scale} fill={DIMENSION_COLOR[entry.dimension]} />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(value: number) => `${value}%`}
                style={{ fill: "#16161D", fontSize: 11, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
