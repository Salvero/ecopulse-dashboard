'use client';
import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Clock, Server, Activity } from 'lucide-react';

interface InferenceHealthCardProps {
    className?: string;
}

export function InferenceHealthCard({ className }: InferenceHealthCardProps) {
    const [sparklineData, setSparklineData] = useState<number[]>([]);

    // Generate sparkline data on mount
    useEffect(() => {
        const data = Array.from({ length: 20 }, () => 35 + Math.random() * 20);
        setSparklineData(data);
    }, []);

    const metrics = [
        {
            label: 'Avg Latency',
            value: '42',
            unit: 'ms',
            status: 'good',
            icon: Clock,
        },
        {
            label: 'Requests/min',
            value: '128',
            unit: '',
            status: 'neutral',
            icon: Zap,
        },
        {
            label: 'Uptime',
            value: '99.9',
            unit: '%',
            status: 'good',
            icon: Server,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return 'text-emerald-600 dark:text-emerald-400';
            case 'warning': return 'text-amber-600 dark:text-amber-400';
            case 'error': return 'text-red-600 dark:text-red-400';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    // Generate SVG path for sparkline
    const generateSparklinePath = () => {
        if (sparklineData.length === 0) return '';
        const width = 100;
        const height = 24;
        const max = Math.max(...sparklineData);
        const min = Math.min(...sparklineData);
        const range = max - min || 1;

        const points = sparklineData.map((val, i) => {
            const x = (i / (sparklineData.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    };

    return (
        <div className={`card p-4 w-full ${className || ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Inference Health</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Healthy</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
                    >
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <metric.icon className={`w-3 h-3 ${getStatusColor(metric.status)}`} />
                        </div>
                        <p className={`text-lg font-bold tabular-nums ${getStatusColor(metric.status)}`}>
                            {metric.value}<span className="text-xs font-normal text-slate-400">{metric.unit}</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Sparkline Chart */}
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Latency (1hr)</span>
                    <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-500" />
                        <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">Stable</span>
                    </div>
                </div>
                <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {sparklineData.length > 0 && (
                        <>
                            <path
                                d={`${generateSparklinePath()} V 24 H 0 Z`}
                                fill="url(#sparklineGradient)"
                            />
                            <path
                                d={generateSparklinePath()}
                                fill="none"
                                stroke="rgb(6, 182, 212)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
}
