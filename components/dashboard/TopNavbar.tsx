'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
    MapPin,
    Sun,
    Moon,
    ChevronDown,
    Activity,
    BarChart3,
    Bell,
    Settings,
    Clock,
    Sparkles
} from 'lucide-react';
import { SystemInsightsModal } from './SystemInsightsModal';

// Minimalist Geometric Logo
function EcoPulseLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                    <path
                        d="M8 28 L14 16 L20 22 L26 10 L32 18"
                        stroke="rgb(13, 148, 136)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="8" cy="28" r="2" fill="rgb(13, 148, 136)" />
                    <circle cx="20" cy="22" r="2" fill="rgb(20, 184, 166)" />
                    <circle cx="32" cy="18" r="2" fill="rgb(13, 148, 136)" />
                </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">EcoPulse</span>
        </div>
    );
}

interface City {
    name: string;
    coords: { lat: number; long: number };
}

interface TopNavbarProps {
    cities: City[];
    selectedCity: City;
    onCityChange: (city: City) => void;
    solarOutput?: number;
    temperature?: number;
}

export function TopNavbar({ cities, selectedCity, onCityChange, solarOutput = 0, temperature = 0 }: TopNavbarProps) {
    const { theme, setTheme } = useTheme();
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-12">

                    {/* Left: Logo & Location */}
                    <div className="flex items-center gap-4">
                        <EcoPulseLogo />
                        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>

                        {/* Location Selector */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <MapPin className="w-3.5 h-3.5 text-teal-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedCity.name}</span>
                                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {cityDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                                    {cities.map((city) => (
                                        <button
                                            key={city.name}
                                            onClick={() => {
                                                onCityChange(city);
                                                setCityDropdownOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${selectedCity.name === city.name
                                                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            <MapPin className={`w-3 h-3 ${selectedCity.name === city.name ? 'text-teal-500' : 'text-slate-400'}`} />
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {[
                            { icon: Activity, label: 'Dashboard', active: true },
                            { icon: BarChart3, label: 'Analytics', active: false },
                            { icon: Clock, label: 'History', active: false },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${item.active
                                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-2">
                        {/* AI Insights Button - Modal Trigger */}
                        <SystemInsightsModal solarOutput={solarOutput} temperature={temperature} />

                        {/* System Status */}
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Online</span>
                        </div>

                        {/* Time */}
                        <span className="hidden md:block text-xs font-mono text-slate-500 tabular-nums">{time || '--:--'}</span>

                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>

                        {/* Actions */}
                        <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                            <Settings className="w-4 h-4" />
                        </button>

                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4 text-cyan-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export const CITIES: City[] = [
    { name: 'Toronto', coords: { lat: 43.6532, long: -79.3832 } },
    { name: 'New York', coords: { lat: 40.7128, long: -74.0060 } },
    { name: 'London', coords: { lat: 51.5074, long: -0.1278 } },
    { name: 'Tokyo', coords: { lat: 35.6762, long: 139.6503 } },
];
