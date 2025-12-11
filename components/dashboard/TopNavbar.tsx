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
    Sparkles,
    Leaf,
    Building2,
    Crown,
    Cherry,
    Waves
} from 'lucide-react';
import { SystemInsightsModal } from './SystemInsightsModal';
import { SystemEventsModal } from './SystemEventsModal';
import { SystemArchitectureModal } from './SystemArchitectureModal';

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

                    {/* Left: Logo */}
                    <div className="flex items-center gap-4">
                        <EcoPulseLogo />
                    </div>

                    {/* Center: Navigation with Dashboard + City Tabs */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {/* Dashboard Tab */}
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400"
                        >
                            <Activity className="w-3.5 h-3.5" />
                            Dashboard
                        </button>

                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        {/* City Tabs with unique icons */}
                        {cities.map((city) => {
                            const isActive = selectedCity.name === city.name;
                            // City-specific icons and colors
                            const cityConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
                                'Toronto': { icon: Leaf, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-500/10' },
                                'New York': { icon: Building2, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
                                'London': { icon: Crown, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
                                'Tokyo': { icon: Cherry, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-500/10' },
                                'Sydney': { icon: Waves, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
                            };
                            const config = cityConfig[city.name] || { icon: MapPin, color: 'text-cyan-500', bgColor: 'bg-cyan-50' };
                            const IconComponent = config.icon;

                            return (
                                <button
                                    key={city.name}
                                    onClick={() => onCityChange(city)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isActive
                                        ? `${config.bgColor} ${config.color}`
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <IconComponent className={`w-3.5 h-3.5 ${config.color}`} />
                                    {city.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-2">
                        {/* AI Insights Button - Modal Trigger */}
                        <SystemInsightsModal solarOutput={solarOutput} temperature={temperature} />

                        {/* System Events Button - Modal Trigger */}
                        <SystemEventsModal />

                        {/* System Architecture Button - Modal Trigger */}
                        <SystemArchitectureModal />

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
    { name: 'Sydney', coords: { lat: -33.8688, long: 151.2093 } },
];
