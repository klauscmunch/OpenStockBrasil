'use client';

import { useId, useRef, useState } from "react";
import type { ChartRange } from "@/lib/constants";

const W = 400;
const H = 150;
const PAD = 6;

const formatTime = (t: number, range: ChartRange) =>
    new Date(t * 1000).toLocaleString('pt-BR', range === '1D'
        ? { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }
        : { day: '2-digit', month: 'short', year: range === '12M' ? '2-digit' : undefined });

// One line, coloured by the period's direction, over a faint fill. The dashed line is the price the
// period started from, so "above the line" reads as a gain. Hover shows the price at that moment.
export default function PriceLineChart({ points, base, range, positive, money }: {
    points: { t: number; c: number }[];
    base: number;
    range: ChartRange;
    positive: boolean;
    money: (value: number) => string;
}) {
    const gradientId = useId();
    const svgRef = useRef<SVGSVGElement>(null);
    const [hover, setHover] = useState<number | null>(null);

    const values = points.map((p) => p.c);
    const min = Math.min(base, ...values);
    const max = Math.max(base, ...values);
    const span = max - min || 1;
    const x = (i: number) => (i / (points.length - 1)) * W;
    const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);

    const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.c).toFixed(1)}`).join(' ');
    const area = `${line} L${W},${H} L0,${H} Z`;
    const color = positive ? 'var(--up)' : 'var(--down)';

    const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        setHover(Math.round(ratio * (points.length - 1)));
    };

    const point = hover !== null ? points[hover] : null;

    return (
        <div className="relative">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="block h-[150px] w-full touch-none"
                onPointerMove={onMove}
                onPointerLeave={() => setHover(null)}
                role="img"
                aria-label={`Gráfico de linha do período ${range}`}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <line x1="0" x2={W} y1={y(base)} y2={y(base)} stroke="var(--line-strong)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                <path d={area} fill={`url(#${gradientId})`} />
                <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                {point && (
                    <line x1={x(hover!)} x2={x(hover!)} y1="0" y2={H} stroke="var(--faint)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                )}
            </svg>
            {point && (
                <span
                    className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-[11.5px] shadow-[0_0_0_1px_var(--line)]"
                    style={{ left: `${Math.min(85, Math.max(15, (hover! / (points.length - 1)) * 100))}%` }}
                >
                    <b className="num text-foreground">{money(point.c)}</b>
                    <span className="text-faint"> · {formatTime(point.t, range)}</span>
                </span>
            )}
            <div className="mono mt-1 flex justify-between text-[11px] text-faint">
                <span>{formatTime(points[0].t, range)}</span>
                <span>{formatTime(points[points.length - 1].t, range)}</span>
            </div>
        </div>
    );
}
