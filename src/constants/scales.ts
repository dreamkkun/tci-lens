import { DimensionType, TCIScale } from "@/types/assessment";

export interface ScaleMeta {
  scale: TCIScale;
  name: string;
  dimension: DimensionType;
  color: string;
}

export const SCALE_META: Record<TCIScale, ScaleMeta> = {
  NS: { scale: "NS", name: "자극추구", dimension: "TEMPERAMENT", color: "#2563eb" },
  HA: { scale: "HA", name: "위험회피", dimension: "TEMPERAMENT", color: "#3b82f6" },
  RD: { scale: "RD", name: "사회적민감성", dimension: "TEMPERAMENT", color: "#60a5fa" },
  PS: { scale: "PS", name: "인내력", dimension: "TEMPERAMENT", color: "#93c5fd" },
  SD: { scale: "SD", name: "자율성", dimension: "CHARACTER", color: "#7c3aed" },
  CO: { scale: "CO", name: "연대감", dimension: "CHARACTER", color: "#8b5cf6" },
  ST: { scale: "ST", name: "자기초월", dimension: "CHARACTER", color: "#a78bfa" },
};

export const SCALE_ORDER: TCIScale[] = ["NS", "HA", "RD", "PS", "SD", "CO", "ST"];
