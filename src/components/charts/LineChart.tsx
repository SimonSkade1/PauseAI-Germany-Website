"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { scaleLinear, scaleTime } from "d3-scale";
import { line as d3Line, area as d3Area, curveMonotoneX } from "d3-shape";
import { extent, bisector, max as d3Max, min as d3Min } from "d3-array";
import { useReducedMotion } from "./useReducedMotion";

export interface LinePoint {
  date: string; // ISO yyyy-mm-dd
  value: number;
}

interface Props {
  data: LinePoint[];
  height?: number;
  yLabel?: string;
}

const NUM = new Intl.NumberFormat("de-DE");
const DATE_LONG = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });
const DATE_SHORT = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" });

const MARGIN = { top: 16, right: 24, bottom: 36, left: 56 };

export default function LineChart({ data, height = 320, yLabel = "Stellenstreichungen / Tag" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<LinePoint | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(Math.max(280, e.contentRect.width));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const parsed = useMemo(
    () => data.map((d) => ({ ...d, t: new Date(d.date) })),
    [data],
  );

  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const x = useMemo(() => {
    const dom = extent(parsed, (d) => d.t) as [Date, Date];
    return scaleTime().domain(dom).range([0, innerW]);
  }, [parsed, innerW]);

  const y = useMemo(() => {
    return scaleLinear()
      .domain([Math.min(0, d3Min(parsed, (d) => d.value) ?? 0), (d3Max(parsed, (d) => d.value) ?? 1) * 1.05])
      .range([innerH, 0])
      .nice();
  }, [parsed, innerH]);

  const linePath = useMemo(() => {
    return d3Line<typeof parsed[number]>()
      .x((d) => x(d.t))
      .y((d) => y(d.value))
      .curve(curveMonotoneX)(parsed) ?? "";
  }, [parsed, x, y]);

  const areaPath = useMemo(() => {
    return d3Area<typeof parsed[number]>()
      .x((d) => x(d.t))
      .y0(innerH)
      .y1((d) => y(d.value))
      .curve(curveMonotoneX)(parsed) ?? "";
  }, [parsed, x, y, innerH]);

  const xTicks = x.ticks(Math.min(6, parsed.length));
  const yTicks = y.ticks(5);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !parsed.length) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = clientX - rect.left - MARGIN.left;
    if (px < 0 || px > innerW) {
      setHover(null);
      return;
    }
    const t = x.invert(px);
    const bi = bisector<typeof parsed[number], Date>((d) => d.t).left;
    const i = bi(parsed, t);
    const d0 = parsed[i - 1];
    const d1 = parsed[i];
    const closest = !d0 ? d1 : !d1 ? d0 : t.getTime() - d0.t.getTime() < d1.t.getTime() - t.getTime() ? d0 : d1;
    setHover(closest);
  };

  if (!parsed.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-pause-black/[0.03] border border-pause-black/10 text-pause-black/50 font-body">
        Keine Daten verfügbar.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Tägliche KI-bedingte Stellenstreichungen"
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX)}
        onTouchEnd={() => setHover(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* y gridlines */}
          {yTicks.map((t) => (
            <line key={t} x1={0} x2={innerW} y1={y(t)} y2={y(t)} stroke="#1a1a1a" strokeOpacity={0.06} />
          ))}
          {/* area under line */}
          <path d={areaPath} fill="#FF9416" fillOpacity={0.10} />
          {/* line */}
          <path
            d={linePath}
            fill="none"
            stroke="#FF9416"
            strokeWidth={2}
            style={reduce ? undefined : { strokeDasharray: 2000, strokeDashoffset: 0, transition: "stroke-dashoffset 1.6s ease-out" }}
          />
          {/* y axis labels */}
          {yTicks.map((t) => (
            <text
              key={`yl-${t}`}
              x={-10}
              y={y(t)}
              dy="0.32em"
              textAnchor="end"
              fontSize={11}
              fill="#1a1a1a"
              fillOpacity={0.55}
              className="font-body tabular-nums"
            >
              {NUM.format(t)}
            </text>
          ))}
          {/* x axis labels */}
          {xTicks.map((t, i) => (
            <text
              key={`xl-${i}`}
              x={x(t)}
              y={innerH + 22}
              textAnchor="middle"
              fontSize={11}
              fill="#1a1a1a"
              fillOpacity={0.55}
              className="font-body"
            >
              {DATE_SHORT.format(t)}
            </text>
          ))}
          {/* x axis line */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke="#1a1a1a" strokeOpacity={0.2} />
          {/* hover marker */}
          {hover && (
            <g>
              <line
                x1={x(new Date(hover.date))}
                x2={x(new Date(hover.date))}
                y1={0}
                y2={innerH}
                stroke="#1a1a1a"
                strokeOpacity={0.25}
                strokeDasharray="3 3"
              />
              <circle
                cx={x(new Date(hover.date))}
                cy={y(hover.value)}
                r={5}
                fill="#FF9416"
                stroke="white"
                strokeWidth={2}
              />
            </g>
          )}
          {/* invisible focusable points for keyboard a11y */}
          {parsed.map((p) => (
            <circle
              key={p.date}
              cx={x(p.t)}
              cy={y(p.value)}
              r={6}
              fill="transparent"
              tabIndex={0}
              onFocus={() => setHover(p)}
              onBlur={() => setHover(null)}
              aria-label={`${DATE_LONG.format(p.t)}: ${NUM.format(p.value)}`}
            />
          ))}
        </g>
      </svg>
      <p className="font-body text-xs text-pause-black/55 mt-2" aria-hidden>
        {yLabel}
      </p>
      <div role="status" aria-live="polite" className="sr-only">
        {hover && `${DATE_LONG.format(new Date(hover.date))}: ${NUM.format(hover.value)} Stellenstreichungen`}
      </div>
      {hover && (
        <div className="font-body text-sm text-pause-black mt-1 tabular-nums">
          <span className="font-body-bold">{DATE_LONG.format(new Date(hover.date))}:</span>{" "}
          <span className="text-[#FF9416] font-body-bold">{NUM.format(hover.value)}</span> Stellenstreichungen
        </div>
      )}
    </div>
  );
}
