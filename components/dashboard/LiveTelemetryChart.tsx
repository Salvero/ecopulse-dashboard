'use client';
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
    Legend,
} from 'recharts';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useWebSocket, TelemetryData } from '@/hooks/useWebSocket';
import { Wifi, WifiOff, AlertTriangle, Zap, Sun, Activity, Power } from 'lucide-react';

interface LiveTelemetryChartProps {
    className?: string;
}

function transformToChartData(history: TelemetryData[]) {
    return history.map((d) => ({
        timestamp: d.timestamp,
        currentUsage: d.metrics.current_usage,
        solarOutput: d.metrics.solar_output,
        gridDependency: d.metrics.grid_dependency,
        anomaly: d.status.anomaly_detected,
    }));
}

export function LiveTelemetryChart({ className }: LiveTelemetryChartProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { data, history, isConnected, error, connect, disconnect } = useWebSocket({
        autoConnect: true,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={`w-full ${className || 'min-h-[200px]'}`} />;

    const chartData = transformToChartData(history);
    const isDark = theme === 'dark';

    // Electric Cyan palette - no orange
    const colors = {
        grid: isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(203, 213, 225, 0.8)",
        text: isDark ? "#94a3b8" : "#475569",
        teal: "#0d9488",         // Energy Usage (primary teal)
        cyan: "#06b6d4",         // Solar Output (electric cyan)
        slate: "#64748b",        // Grid Dependency
    };

    return (
        <div className={`card ${className || ''}`}>
            <div className="p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Live Telemetry</h3>

                        {isConnected ? (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                Live
                            </span>
                        ) : (
                            <span className="text-xs text-slate-500 font-medium">Offline</span>
                        )}
                    </div>

                    <button
                        onClick={isConnected ? disconnect : connect}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${isConnected
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                            }`}
                    >
                        {isConnected ? <><WifiOff className="w-3 h-3" />Disconnect</> : <><Wifi className="w-3 h-3" />Connect</>}
                    </button>
                </div>

                {/* Live Stats */}
                {isConnected && data && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                                <Zap className="w-3 h-3 text-teal-500" />
                                <span className="text-xs text-teal-700 dark:text-teal-400">Usage</span>
                            </div>
                            <p className="text-lg font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                                {data.metrics.current_usage}<span className="text-xs font-normal ml-0.5">kWh</span>
                            </p>
                        </div>

                        <div className="rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                                <Sun className="w-3 h-3 text-cyan-500" />
                                <span className="text-xs text-cyan-700 dark:text-cyan-400">Solar</span>
                            </div>
                            <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
                                {data.metrics.solar_output}<span className="text-xs font-normal ml-0.5">kWh</span>
                            </p>
                        </div>

                        <div className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                                <Power className="w-3 h-3 text-slate-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Grid</span>
                            </div>
                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                                {data.metrics.grid_dependency}<span className="text-xs font-normal ml-0.5">kWh</span>
                            </p>
                        </div>

                        <div className={`rounded-lg p-2.5 border ${data.status.anomaly_detected
                            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                            }`}>
                            <div className="flex items-center gap-1 mb-1">
                                {data.status.anomaly_detected
                                    ? <AlertTriangle className="w-3 h-3 text-red-500" />
                                    : <Activity className="w-3 h-3 text-emerald-500" />
                                }
                                <span className={`text-xs ${data.status.anomaly_detected ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                                    }`}>Status</span>
                            </div>
                            <p className={`text-sm font-bold ${data.status.anomaly_detected ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                                }`}>
                                {data.status.anomaly_detected ? 'Anomaly' : 'Normal'}
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Chart */}
                <div className="h-[220px]">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                <XAxis
                                    dataKey="timestamp"
                                    stroke={colors.text}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        try { return value.split('T')[1].slice(0, 5); }
                                        catch { return value; }
                                    }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    yAxisId="left"
                                    stroke={colors.text}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    width={35}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                        borderRadius: '8px',
                                        border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} iconType="circle" iconSize={6} />

                                <defs>
                                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.teal} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={colors.teal} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>

                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="currentUsage"
                                    name="Usage"
                                    fill="url(#usageGradient)"
                                    stroke={colors.teal}
                                    strokeWidth={2.5}
                                    animationDuration={300}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="solarOutput" name="Solar" stroke={colors.cyan} strokeWidth={2} dot={false} animationDuration={300} />
                                <Line yAxisId="left" type="monotone" dataKey="gridDependency" name="Grid" stroke={colors.slate} strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={300} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <Wifi className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm text-slate-500">Click "Connect" to start streaming</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
