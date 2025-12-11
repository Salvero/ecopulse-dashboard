'use client';
import React from 'react';
import { Leaf, TrendingUp, TrendingDown, Zap, Sun, Activity, Gauge, Wind } from 'lucide-react';

interface EnergyMixCardProps {
    solarOutput?: number;
    gridUsage?: number;
    peakToday?: number;
    avgAQI?: number;
    className?: string;
}

export function EnergyMixCard({
    solarOutput = 0,
    gridUsage = 0,
    peakToday = 0,
    avgAQI = 0,
    className
}: EnergyMixCardProps) {
    const totalEnergy = solarOutput + gridUsage;
    const solarPercent = totalEnergy > 0 ? Math.round((solarOutput / totalEnergy) * 100) : 0;
    const gridPercent = 100 - solarPercent;

    // CO2 calculations
    const co2Intensity = Math.round((gridPercent * 400 + solarPercent * 40) / 100);
    const avgCO2 = 250;
    const co2Diff = Math.abs(co2Intensity - avgCO2);
    const co2DiffPercent = Math.round((co2Diff / avgCO2) * 100);
    const isBetterThanAvg = co2Intensity < avgCO2;

    // Carbon status color
    const getLeafColor = () => {
        if (co2Intensity < 150) return 'text-emerald-500';
        if (co2Intensity < 300) return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className={`card w-full ${className || ''}`}>
            {/* Header */}
            <div className="p-4 pb-0">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Sustainability Intelligence</h3>
                </div>
            </div>

            {/* TOP ROW: 50/50 Split - Energy Mix | Carbon Impact */}
            <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-0">
                    {/* LEFT: Energy Source Mix (50%) */}
                    <div className="pr-4">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Energy Source Mix</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500"
                                    style={{ width: `${solarPercent}%` }}
                                />
                                <div
                                    className="h-full bg-slate-400 dark:bg-slate-600 transition-all duration-500"
                                    style={{ width: `${gridPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Solar vs Grid */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4 text-cyan-500" />
                                <div>
                                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">{solarPercent}%</p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Solar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-slate-500" />
                                <div>
                                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums">{gridPercent}%</p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Grid</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Carbon Impact (50%) with border-left */}
                    <div className="pl-4 border-l border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Carbon Impact</p>

                        {/* Large CO2 Metric */}
                        <div className="flex items-center gap-3 mb-3">
                            <Leaf className={`w-6 h-6 ${getLeafColor()}`} />
                            <div>
                                <p className={`text-4xl font-bold tabular-nums ${isBetterThanAvg ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {co2Intensity}
                                    <span className="text-lg font-medium text-slate-400 ml-1">g</span>
                                </p>
                                <p className="text-xs text-slate-500">CO₂ per kWh</p>
                            </div>
                        </div>

                        {/* Trend Pill */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold w-fit ${isBetterThanAvg
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                            {isBetterThanAvg ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                            {isBetterThanAvg ? `↓ ${co2DiffPercent}%` : `↑ ${co2DiffPercent}%`}
                            <span className="text-slate-400 font-normal text-xs ml-1">vs avg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: 4 KPIs - Full Width with Border Top */}
            <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 px-4 pb-4">
                <div className="grid grid-cols-4 gap-4">
                    {/* Peak Today */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <TrendingUp className="w-4 h-4 text-cyan-500" />
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                            {peakToday.toFixed(0)}<span className="text-xs font-normal text-slate-400 ml-0.5">kWh</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Peak Today</p>
                    </div>

                    {/* Avg AQI */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Wind className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                            {avgAQI.toFixed(0)}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Avg AQI</p>
                    </div>

                    {/* Grid Draw */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Zap className="w-4 h-4 text-slate-500" />
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                            {gridPercent}<span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Grid Draw</p>
                    </div>

                    {/* Efficiency */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Gauge className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                            87<span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Efficiency</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
