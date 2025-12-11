'use client';
import React, { useState } from 'react';
import { Layers, X, Cpu, Database, Server, Cloud } from 'lucide-react';

const techStack = [
    { name: 'FastAPI', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
    { name: 'TensorFlow', color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' },
    { name: 'Next.js', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
    { name: 'Docker', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' },
];

export function SystemArchitectureModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                <Layers className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden sm:inline">Architecture</span>
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
                                    <Layers className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">System Architecture</h2>
                                    <p className="text-xs text-slate-500">Full-stack energy analytics platform</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Abstract Text */}
                            <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                    <span className="font-semibold text-slate-900 dark:text-white">EcoPulse</span> is a full-stack energy analytics platform powered by a custom <span className="text-cyan-600 dark:text-cyan-400 font-medium">LSTM Neural Network</span>. It ingests real-time telemetry to predict load spikes 24 hours in advance, optimizing grid dependency and carbon footprint.
                                </p>
                            </div>

                            {/* Architecture Flow */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Data Pipeline</p>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                            <Database className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Data</p>
                                            <p className="text-xs text-slate-500">Ingestion</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                                            <Cpu className="w-5 h-5 text-cyan-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">ML</p>
                                            <p className="text-xs text-slate-500">Inference</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                                            <Server className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">API</p>
                                            <p className="text-xs text-slate-500">FastAPI</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                            <Cloud className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">UI</p>
                                            <p className="text-xs text-slate-500">Next.js</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Technology Stack</p>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${tech.color} 
                                                       hover:scale-105 transition-transform cursor-default`}
                                        >
                                            {tech.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <p className="text-xs text-slate-500 text-center">
                                Built with ❤️ for intelligent energy management
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
