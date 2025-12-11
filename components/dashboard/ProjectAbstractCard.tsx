'use client';
import React from 'react';
import { Cpu, Layers, Zap, Database, Server, Cloud } from 'lucide-react';

interface ProjectAbstractCardProps {
    className?: string;
}

const techStack = [
    { name: 'FastAPI', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
    { name: 'TensorFlow', color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' },
    { name: 'Next.js', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
    { name: 'Docker', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' },
];

export function ProjectAbstractCard({ className }: ProjectAbstractCardProps) {
    return (
        <div className={`card p-4 w-full ${className || ''}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">System Architecture</h3>
            </div>

            {/* Abstract Text */}
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-4">
                <span className="font-semibold text-slate-900 dark:text-white">EcoPulse</span> is a full-stack energy analytics platform powered by a custom <span className="text-cyan-600 dark:text-cyan-400 font-medium">LSTM Neural Network</span>. It ingests real-time telemetry to predict load spikes 24 hours in advance, optimizing grid dependency and carbon footprint.
            </p>

            {/* Architecture Icons */}
            <div className="flex items-center justify-between mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-slate-500">Data</span>
                </div>
                <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-slate-500">ML</span>
                </div>
                <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-slate-500">API</span>
                </div>
                <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-500">UI</span>
                </div>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                    <span
                        key={index}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tech.color} 
                                   hover:scale-105 transition-transform cursor-default`}
                    >
                        {tech.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
