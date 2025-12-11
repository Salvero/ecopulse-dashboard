'use client';
import React, { useState, useEffect } from 'react';
import { Terminal, X, AlertTriangle, RefreshCw, Radio, CheckCircle, Zap, Database } from 'lucide-react';

interface LogEvent {
    id: number;
    time: string;
    message: string;
    type: 'warning' | 'success' | 'info' | 'error';
    icon: React.ElementType;
}

const eventColors = {
    warning: 'text-amber-500',
    success: 'text-cyan-500',
    info: 'text-slate-500',
    error: 'text-red-500',
};

export function SystemEventsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState<LogEvent[]>([]);

    useEffect(() => {
        // Initial events
        const initialEvents: LogEvent[] = [
            { id: 1, time: '14:02', message: 'Grid usage spike detected', type: 'warning', icon: AlertTriangle },
            { id: 2, time: '14:00', message: 'Model inference completed', type: 'success', icon: RefreshCw },
            { id: 3, time: '13:58', message: 'Sensor #4 reconnected', type: 'info', icon: Radio },
            { id: 4, time: '13:55', message: 'Cache refreshed (128 entries)', type: 'success', icon: Database },
            { id: 5, time: '13:52', message: 'WebSocket client connected', type: 'info', icon: Terminal },
            { id: 6, time: '13:50', message: 'Anomaly score: 0.12 (Normal)', type: 'success', icon: CheckCircle },
        ];
        setEvents(initialEvents);

        // Simulate new events periodically
        const interval = setInterval(() => {
            const newEventTypes: Array<{ message: string; type: 'warning' | 'success' | 'info'; icon: React.ElementType }> = [
                { message: 'Model inference completed', type: 'success', icon: RefreshCw },
                { message: 'Prediction cached', type: 'success', icon: Database },
                { message: 'Telemetry packet received', type: 'info', icon: Radio },
                { message: 'Grid load balanced', type: 'success', icon: Zap },
            ];

            const randomEvent = newEventTypes[Math.floor(Math.random() * newEventTypes.length)];
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            setEvents(prev => [{
                id: Date.now(),
                time: timeStr,
                message: randomEvent.message,
                type: randomEvent.type,
                icon: randomEvent.icon,
            }, ...prev.slice(0, 9)]);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden sm:inline">Events</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Terminal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">System Events</h2>
                                    <p className="text-xs text-slate-500">Live event log</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Live</span>
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        {/* Terminal Content */}
                        <div className="p-4">
                            <div className="rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden">
                                {/* Terminal Header */}
                                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-mono text-slate-500 ml-2">ecopulse-events</span>
                                </div>

                                {/* Log Entries */}
                                <div className="max-h-[300px] overflow-y-auto p-3 space-y-1.5 font-mono">
                                    {events.map((event) => {
                                        const IconComponent = event.icon;
                                        return (
                                            <div
                                                key={event.id}
                                                className="flex items-start gap-2 px-2 py-2 rounded hover:bg-slate-800/50 transition-colors"
                                            >
                                                <span className="text-xs text-slate-500 tabular-nums shrink-0">[{event.time}]</span>
                                                <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${eventColors[event.type]}`} />
                                                <span className="text-sm text-slate-300 leading-tight">{event.message}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <p className="text-xs text-slate-500 text-center">
                                Auto-updates every 8 seconds • Showing latest 10 events
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
