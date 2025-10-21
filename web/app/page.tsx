import React from 'react';
import { computeWaterfall } from '@chartcraft/charts-core';

export default function Page() {
  const data = {
    start: 1035,
    items: [
      { label: 'Sales', value: 200 },
      { label: 'Returns', value: -50 },
      { label: 'Marketing', value: -150 }
    ],
    end: 1035 + 200 - 50 - 150
  } as any;

  const res = computeWaterfall(data);

  const width = 800;
  const height = 300;
  const margin = 40;
  const domainMin = res.min;
  const domainMax = res.max;
  const scaleY = (v: number) => {
    const span = domainMax - domainMin || 1;
    return margin + (1 - (v - domainMin) / span) * (height - margin * 2);
  };

  return (
    <html>
      <body>
        <h1>ChartCraft — Waterfall Demo</h1>
        <svg width={width} height={height} role="img">
          {res.items.map((it, i) => {
            const y0 = scaleY(it.runningStart);
            const y1 = scaleY(it.runningEnd);
            const barHeight = Math.abs(y1 - y0);
            const x = 80 + i * 120;
            const barY = Math.min(y0, y1);
            return (
              <g key={i}>
                <rect x={x} y={barY} width={60} height={barHeight} fill={it.runningEnd >= it.runningStart ? '#2b8a3e' : '#d62828'} />
                <text x={x + 30} y={barY - 6} fontSize={12} textAnchor="middle">{it.label}</text>
              </g>
            );
          })}
        </svg>
      </body>
    </html>
  );
}
