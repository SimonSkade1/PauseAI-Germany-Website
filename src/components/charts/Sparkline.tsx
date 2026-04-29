"use client";

import { line as d3Line, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { extent, max as d3Max, min as d3Min } from "d3-array";
import { useMemo } from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  ariaLabel?: string;
}

export default function Sparkline({
  data,
  width = 240,
  height = 40,
  color = "#FF9416",
  ariaLabel = "Verlauf der letzten 90 Tage",
}: Props) {
  const path = useMemo(() => {
    if (!data.length) return "";
    const x = scaleLinear()
      .domain(extent(data.map((_, i) => i)) as [number, number])
      .range([2, width - 2]);
    const y = scaleLinear()
      .domain([d3Min(data) ?? 0, d3Max(data) ?? 1])
      .range([height - 2, 2])
      .nice();
    const generator = d3Line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(curveMonotoneX);
    return generator(data) ?? "";
  }, [data, width, height]);

  if (!path) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className="overflow-visible"
    >
      <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
