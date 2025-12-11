'use client';
import React from 'react';
import { Leaf, TrendingUp, TrendingDown, Zap, Sun } from 'lucide-react';

interface EnergyMixCardProps {
    solarOutput?: number;
    gridUsage?: number;
    className?: string;
}

export function EnergyMixCard({ solarOutput = 0, gridUsage = 0, className }: EnergyMixCardProps) {
    const totalEnergy = solarOutput + gridUsage;
    const solarPercent = totalEnergy > 0 ? Math.round((solarOutput / totalEnergy) * 100) : 0;
    const gridPercent = 100 - solarPercent;

    const co2Intensity = Math.round((gridPercent * 400 + solarPercent * 40) / 100);
    const avgCO2 = 250;
    const co2Trend = co2Intensity < avgCO2 ? 'better' : 'worse';
    const co2Diff = Math.abs(co2Intensity - avgCO2);

    const getCleanStatus = () => {
        if (solarPercent >= 50) return { label: 'Clean', color: 'text-cyan-600 dark:text-cyan-400' };
        if (solarPercent >= 25) return { label: 'Mixed', color: 'text-slate-500 dark:text-slate-400' };
        return { label: 'Grid Heavy', color: 'text-slate-500' };
    };

    const cleanStatus = getCleanStatus();

    return (
        <div className={`card p-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                        <Leaf className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Energy Mix</h3>
                </div>
                <span className={`text-xs font-semibold ${cleanStatus.color}`}>{cleanStatus.label}</span>
            </div>

            {/* Segmented Bar */}
            <div className="mb-3">
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${solarPercent}%` }} />
                    <div className="h-full bg-slate-500 dark:bg-slate-600 transition-all duration-500" style={{ width: `${gridPercent}%` }} />
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-cyan-500" />
                    <div>
                        <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{solarPercent}%</p>
                        <p className="text-xs text-slate-500">Solar</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-500" />
                    <div>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{gridPercent}%</p>
                        <p className="text-xs text-slate-500">Grid</p>
                    </div>
                </div>
            </div>

            {/* CO2 Metric */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <span className="text-base">🌱</span>
                    <div>
                        <p className="text-xs text-slate-500">CO₂ Intensity</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {co2Intensity}<span className="text-xs font-normal text-slate-500 ml-0.5">g/kWh</span>
                        </p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${co2Trend === 'better'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                    {co2Trend === 'better' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {co2Trend === 'better' ? `-${co2Diff}` : `+${co2Diff}`}
                </div>
            </div>
        </div>
    );
}
