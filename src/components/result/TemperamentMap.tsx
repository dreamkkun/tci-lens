"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { SCALE_ORDER } from "@/constants/scales";
import { ScaleResult, TCIScale } from "@/types/assessment";
import { SectionTitle } from "@/components/result/SectionTitle";

interface TemperamentMapProps {
  results: Record<TCIScale, ScaleResult>;
  simulatedNames: string[];
}

interface AxisTickProps {
  x: number;
  y: number;
  cx: number;
  cy: number;
  textAnchor: "start" | "middle" | "end" | "inherit";
  payload: { value: string };
  results: Record<TCIScale, ScaleResult>;
}

function AxisTick({ x, y, cx, cy, textAnchor, payload, results }: AxisTickProps) {
  const scale = payload.value as TCIScale;
  const result = results[scale];
  const isTop = y < cy - 4;

  return (
    <text x={x} y={y} textAnchor={textAnchor} fontSize={11} fill="#16161D">
      <tspan x={x} dy={isTop ? "-0.35em" : "0.35em"} fontWeight={700}>
        {result.scaleName}
      </tspan>
      <tspan x={x} dy="1.25em" fontWeight={900}>
        {scale} {result.percentage}
      </tspan>
    </text>
  );
}

export function TemperamentMap({ results, simulatedNames }: TemperamentMapProps) {
  const data = SCALE_ORDER.map((scale) => ({ scale, value: results[scale].percentage }));

  return (
    <section className="space-y-3">
      <SectionTitle
        title="7가지 기질 지도"
        subtitle={`${simulatedNames.join(", ")} 3개 기질이 아래 시뮬레이션에 반영됩니다.`}
      />
      <Card className="px-2 py-4">
        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              outerRadius={88}
              margin={{ top: 30, right: 10, bottom: 30, left: 10 }}
            >
              <PolarGrid stroke="#E6DDD0" />
              <PolarAngleAxis
                dataKey="scale"
                tick={(props: Omit<AxisTickProps, "results">) => (
                  <AxisTick {...props} results={results} />
                )}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                dataKey="value"
                stroke="#E5484D"
                strokeWidth={2}
                fill="#F7A8B5"
                fillOpacity={0.55}
                dot={{ r: 3.5, fill: "#E5484D", stroke: "#FFFFFF", strokeWidth: 1 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}
