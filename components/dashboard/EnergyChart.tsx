import React from 'react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { DashboardDataPoint } from '@/types/dashboard';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface EnergyChartProps {
    data: DashboardDataPoint[];
    mode?: 'combined' | 'solar' | 'aqi';
    className?: string;
}

export function EnergyChart({ data, mode = 'combined', className }: EnergyChartProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={`w-full ${className || 'h-[300px]'}`} />;

    const showSolar = mode === 'combined' || mode === 'solar';
    const showAQI = mode === 'combined' || mode === 'aqi';

    const isDark = theme === 'dark';
    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const tooltipBg = isDark ? "#1e293b" : "#ffffff";
    const tooltipBorder = isDark ? "#334155" : "#e2e8f0";
    const tooltipText = isDark ? "#f8fafc" : "#0f172a";

    return (
        <div className={`w-full ${className || 'h-[300px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    <defs>
                        <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        stroke={textColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                            try {
                                return value.split('T')[1].slice(0, 5);
                            } catch {
                                return value;
                            }
                        }}
                    />
                    {/* Left Y-Axis: Air Quality Index */}
                    {showAQI && (
                        <YAxis
                            yAxisId="left"
                            stroke="#ef4444"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'AQI', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 10 }}
                        />
                    )}
                    {/* Right Y-Axis: Solar Output */}
                    {showSolar && (
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#06b6d4"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'W/m²', angle: 90, position: 'insideRight', fill: '#06b6d4', fontSize: 10 }}
                        />
                    )}
                    <Tooltip
                        contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                        itemStyle={{ color: tooltipText }}
                        labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '0.5rem' }}
                        formatter={(value: number, name: string) => {
                            if (name === 'Air Quality Index') return [`${value}`, 'AQI'];
                            if (name === 'Solar Output') return [`${value} W/m²`, 'Solar'];
                            return [value, name];
                        }}
                        labelFormatter={(label) => {
                            try {
                                return label.split('T')[1].slice(0, 5);
                            } catch {
                                return label;
                            }
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />

                    {showAQI && (
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="airQualityIndex"
                            name="Air Quality Index"
                            fill="url(#colorAQI)"
                            stroke="#ef4444"
                            strokeWidth={2}
                        />
                    )}
                    {showSolar && (
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="solarOutput"
                            name="Solar Output"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#06b6d4' }}
                        />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
