'use client';
import React, { useEffect, useState } from 'react';
import { Terminal, AlertTriangle, RefreshCw, Radio, CheckCircle, Zap, Database } from 'lucide-react';

interface LogEvent {
    id: number;
    time: string;
    message: string;
    type: 'warning' | 'success' | 'info' | 'error';
    icon: React.ElementType;
}

interface EventLogCardProps {
    className?: string;
}

const eventIcons = {
    warning: AlertTriangle,
    success: RefreshCw,
    info: Radio,
    error: Zap,
};

const eventColors = {
    warning: 'text-amber-500',
    success: 'text-cyan-500',
    info: 'text-slate-500',
    error: 'text-red-500',
};

const eventBgColors = {
    warning: 'bg-amber-50 dark:bg-amber-500/10',
    success: 'bg-cyan-50 dark:bg-cyan-500/10',
    info: 'bg-slate-50 dark:bg-slate-800',
    error: 'bg-red-50 dark:bg-red-500/10',
};

export function EventLogCard({ className }: EventLogCardProps) {
    const [events, setEvents] = useState<LogEvent[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

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
            }, ...prev.slice(0, 5)]);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className={`card p-4 w-full ${className || ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Terminal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">System Events</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">Live</span>
            </div>

            {/* Event Log - Terminal Style */}
            <div className="rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-mono text-slate-500 ml-2">ecopulse-events</span>
                </div>

                {/* Log Entries */}
                <div className="max-h-[140px] overflow-y-auto p-2 space-y-1 font-mono">
                    {events.map((event) => {
                        const IconComponent = event.icon;
                        return (
                            <div
                                key={event.id}
                                className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 transition-colors"
                            >
                                <span className="text-[10px] text-slate-500 tabular-nums shrink-0">[{event.time}]</span>
                                <IconComponent className={`w-3 h-3 mt-0.5 shrink-0 ${eventColors[event.type]}`} />
                                <span className="text-xs text-slate-300 leading-tight">{event.message}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
