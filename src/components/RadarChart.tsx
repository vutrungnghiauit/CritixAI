import React from 'react';

interface RadarChartProps {
  scores: {
    logic: number;
    evidence: number;
    rebuttal: number;
    toulmin: number;
    multiPerspective: number;
  };
  benchmarkScores?: {
    logic: number;
    evidence: number;
    rebuttal: number;
    toulmin: number;
    multiPerspective: number;
  };
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  benchmarkScores = { logic: 70, evidence: 68, rebuttal: 65, toulmin: 68, multiPerspective: 70 },
  size = 320
}) => {
  // Generous padding to prevent Vietnamese labels from being clipped
  const padding = 85;
  const totalSize = size + padding * 2;
  const centerX = totalSize / 2;
  const centerY = totalSize / 2;
  const radius = size / 2;

  const categories = [
    { key: 'logic', label: 'Logic & Tiền đề', angle: -90 },
    { key: 'evidence', label: 'Dẫn chứng Thực tiễn', angle: -18 },
    { key: 'rebuttal', label: 'Phản biện Rebuttal', angle: 54 },
    { key: 'toulmin', label: 'Cấu trúc Toulmin', angle: 126 },
    { key: 'multiPerspective', label: 'Tầm nhìn Đa chiều', angle: 198 }
  ];

  const getCoordinates = (value: number, angleDegrees: number) => {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad)
    };
  };

  const getLabelCoordinates = (angleDegrees: number) => {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const r = radius + 32;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad)
    };
  };

  // Concentric polygon grids (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  // User polygon points
  const userPoints = categories.map(cat => {
    const score = scores[cat.key as keyof typeof scores] || 70;
    const pt = getCoordinates(score, cat.angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Benchmark polygon points
  const benchmarkPoints = categories.map(cat => {
    const score = benchmarkScores[cat.key as keyof typeof benchmarkScores] || 70;
    const pt = getCoordinates(score, cat.angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        className="w-full max-w-[380px] h-auto drop-shadow-sm select-none"
      >
        {/* Background grids */}
        {gridLevels.map(level => {
          const points = categories.map(cat => {
            const pt = getCoordinates(level, cat.angle);
            return `${pt.x},${pt.y}`;
          }).join(' ');

          return (
            <polygon
              key={`grid-${level}`}
              points={points}
              fill={level === 100 ? 'rgba(59, 130, 246, 0.03)' : 'none'}
              stroke="currentColor"
              strokeDasharray={level < 100 ? '2,2' : undefined}
              className="text-slate-300 dark:text-slate-700"
              strokeWidth={level === 100 ? '1.5' : '1'}
            />
          );
        })}

        {/* Spokes */}
        {categories.map((cat, idx) => {
          const outerPt = getCoordinates(100, cat.angle);
          return (
            <line
              key={`spoke-${idx}`}
              x1={centerX}
              y1={centerY}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700"
              strokeWidth="1"
            />
          );
        })}

        {/* Benchmark polygon */}
        <polygon
          points={benchmarkPoints}
          fill="rgba(148, 163, 184, 0.15)"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />

        {/* User polygon */}
        <polygon
          points={userPoints}
          fill="rgba(59, 130, 246, 0.25)"
          stroke="#2563eb"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* User points */}
        {categories.map((cat, idx) => {
          const score = scores[cat.key as keyof typeof scores] || 70;
          const pt = getCoordinates(score, cat.angle);
          return (
            <circle
              key={`pt-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />
          );
        })}

        {/* Category Labels */}
        {categories.map((cat, idx) => {
          const labelPt = getLabelCoordinates(cat.angle);
          const score = scores[cat.key as keyof typeof scores] || 70;
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (cat.angle > -60 && cat.angle < 60) textAnchor = 'start';
          else if (cat.angle > 120 || cat.angle < -120) textAnchor = 'end';

          return (
            <g key={`lbl-${idx}`}>
              <text
                x={labelPt.x}
                y={labelPt.y - 4}
                textAnchor={textAnchor}
                className="text-[12px] font-semibold fill-slate-800 dark:fill-slate-100"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {cat.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 12}
                textAnchor={textAnchor}
                className="text-[11px] font-bold fill-blue-600 dark:fill-blue-400"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {score}/100
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-blue-500/30 border border-blue-600 inline-block"></span>
          <span className="font-medium text-slate-900 dark:text-slate-200">Năng lực sinh viên</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
          <span>Chuẩn trung bình ĐH (70)</span>
        </div>
      </div>
    </div>
  );
};
