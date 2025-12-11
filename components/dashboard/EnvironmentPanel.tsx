'use client';
import React from 'react';
import {
    Thermometer,
    Sun,
    Wind,
    Droplets,
    Sunrise,
    Sunset,
    CloudSun,
    Cloud,
    CloudRain,
    Snowflake
} from 'lucide-react';
import { DailyForecast } from '@/lib/normalize';

interface EnvironmentPanelProps {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    uvIndex?: number;
    forecast?: DailyForecast[];
    className?: string;
}

const weatherIcons: Record<string, React.ElementType> = {
    sunny: Sun,
    cloudy: Cloud,
    partlyCloudy: CloudSun,
    rain: CloudRain,
    snow: Snowflake,
};

export function EnvironmentPanel({
    temperature = 0,
    humidity = 0,
    windSpeed = 0,
    uvIndex = 0,
    forecast = [],
    className
}: EnvironmentPanelProps) {

    const getUVStatus = () => {
        if (uvIndex >= 8) return { level: 'Very High', color: 'text-red-500' };
        if (uvIndex >= 6) return { level: 'High', color: 'text-red-400' };
        if (uvIndex >= 3) return { level: 'Moderate', color: 'text-cyan-500' };
        return { level: 'Low', color: 'text-emerald-500' };
    };

    const uvStatus = getUVStatus();

    return (
        <div className={`card h-full ${className}`}>
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                        <CloudSun className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Environment</h3>
                </div>

                {/* Conditions Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Thermometer className="w-3 h-3 text-teal-500" />
                            <span className="text-xs uppercase tracking-wider text-slate-500">Temp</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                            {temperature}<span className="text-xs font-normal text-slate-400">°C</span>
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <span className="text-xs uppercase tracking-wider text-slate-500">Humidity</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                            {humidity}<span className="text-xs font-normal text-slate-400">%</span>
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Wind className="w-3 h-3 text-slate-500" />
                            <span className="text-xs uppercase tracking-wider text-slate-500">Wind</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                            {windSpeed}<span className="text-xs font-normal text-slate-400">km/h</span>
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Sun className={`w-3 h-3 ${uvStatus.color}`} />
                            <span className="text-xs uppercase tracking-wider text-slate-500">UV</span>
                        </div>
                        <p className={`text-lg font-bold ${uvStatus.color} tabular-nums`}>
                            {uvIndex}
                        </p>
                    </div>
                </div>

                {/* Sun Phase */}
                <div className="flex items-center gap-3 mb-4 p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30">
                    <div className="flex items-center gap-2">
                        <Sunrise className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <div>
                            <p className="text-xs text-slate-500">Rise</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">06:42</p>
                        </div>
                    </div>
                    <div className="flex-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 opacity-40"></div>
                    <div className="flex items-center gap-2">
                        <Sunset className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <div>
                            <p className="text-xs text-slate-500">Set</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">20:15</p>
                        </div>
                    </div>
                </div>

                {/* 5-Day Forecast */}
                <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">5-Day Forecast</p>
                    <div className="flex gap-1.5">
                        {forecast.slice(0, 5).map((day, index) => {
                            const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                            const IconComponent = weatherIcons[day.icon] || CloudSun;

                            return (
                                <div
                                    key={index}
                                    className="flex-1 text-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                >
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">{dayName}</p>
                                    <IconComponent className="w-4 h-4 mx-auto mb-0.5 text-cyan-500" />
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(day.tempMax)}°</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
