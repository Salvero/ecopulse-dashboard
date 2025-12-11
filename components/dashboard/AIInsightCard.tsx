'use client';
import React from 'react';
import { Brain, TrendingUp, AlertTriangle, RefreshCw, Cpu } from 'lucide-react';
import { usePrediction } from '@/hooks/usePrediction';

interface AIInsightCardProps {
    className?: string;
}

export function AIInsightCard({ className }: AIInsightCardProps) {
    const { prediction, loading, error, refresh, backendAvailable } = usePrediction({
        autoFetch: true,
        pollingInterval: 30000,
    });

    const isOnline = backendAvailable;

    const confidencePercent = prediction?.confidence_score
        ? Math.round(prediction.confidence_score * 100)
        : 0;

    const getConfidenceStatus = () => {
        if (confidencePercent >= 80) return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' };
        if (confidencePercent >= 60) return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' };
        return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' };
    };

    const status = getConfidenceStatus();

    return (
        <div className={`card p-4 ${className}`}>
            {/* Header - Compact */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">AI Forecast</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">LSTM Neural Network</p>
                    </div>
                </div>

                <button
                    onClick={refresh}
                    disabled={loading}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Hero Prediction - Compact */}
            <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Next Hour Predicted Usage</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tabular-nums text-teal-600 dark:text-teal-400">
                        {loading ? '---' : prediction?.predicted_usage?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-sm font-medium text-slate-400">kWh</span>
                </div>
            </div>

            {/* Confidence Bar - Thinner */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Confidence</span>
                    <span className={`text-sm font-bold ${status.color}`}>
                        {loading ? '--' : `${confidencePercent}%`}
                    </span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${status.bg} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: loading ? '0%' : `${confidencePercent}%` }}
                    />
                </div>
            </div>

            {/* Status Grid - Compact */}
            <div className="grid grid-cols-2 gap-2">
                <div className={`rounded-lg p-3 ${isOnline
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30'
                    }`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Cpu className={`w-3 h-3 ${isOnline ? 'text-emerald-500' : 'text-red-500'}`} />
                        <span className={`text-xs font-semibold ${isOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isOnline ? 'Model Active' : 'Simulation'}
                    </p>
                </div>

                <div className={`rounded-lg p-3 border ${prediction?.anomaly_detected
                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        {prediction?.anomaly_detected ? (
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                        ) : (
                            <TrendingUp className="w-3 h-3 text-slate-400" />
                        )}
                        <span className={`text-xs font-semibold ${prediction?.anomaly_detected
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                            {prediction?.anomaly_detected ? 'Alert' : 'Normal'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {prediction?.anomaly_detected ? 'Anomaly' : 'No issues'}
                    </p>
                </div>
            </div>
        </div>
    );
}
