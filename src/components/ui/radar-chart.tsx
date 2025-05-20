import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface RadarChartProps {
  data: Array<{
    subject: string;
    value: number;
    fullMark?: number;
  }>;
  className?: string;
}

export function RadarChart({ data, className }: RadarChartProps) {
  return (
    <div className={`w-full h-[350px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            formatter={(value) => [`${value}%`, 'Puntuación']}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
} 