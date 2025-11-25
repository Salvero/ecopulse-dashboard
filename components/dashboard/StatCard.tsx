import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    loading?: boolean;
    unit?: string;
}

export function StatCard({ title, value, trend, loading, unit }: StatCardProps) {
    if (loading) {
        return (
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
                </div>

                {trend && (
                    <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-red-600' :
                            trend === 'down' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                        {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                        {trend === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
                        <span className="sr-only">{trend} trend</span>
                    </div>
                )}
            </div>
        </div>
    );
}
