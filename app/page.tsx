'use client';

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { EnergyChart } from '@/components/dashboard/EnergyChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { CloudSun, Leaf, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error loading dashboard: {error.message}</div>
      </div>
    );
  }

  // Calculate current stats from the latest data point or defaults
  const currentEnergy = data?.energyData[data.energyData.length - 1];
  const currentIntensity = currentEnergy?.carbonIntensity ?? 0;
  const currentSolar = currentEnergy?.solarOutput ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            EcoPulse Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Real-time environmental and energy monitoring</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Temperature"
            value={data?.weather.temperature ?? 0}
            unit="°C"
            loading={loading}
            trend="neutral"
          />
          <StatCard
            title="Humidity"
            value={data?.weather.humidity ?? 0}
            unit="%"
            loading={loading}
            trend="up"
          />
          <StatCard
            title="Carbon Intensity"
            value={currentIntensity}
            unit="gCO2/kWh"
            loading={loading}
            trend="down"
          />
          <StatCard
            title="Solar Output"
            value={currentSolar}
            unit="W/m²"
            loading={loading}
            trend="up"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Energy Correlation Analysis
            </h2>
            {loading ? (
              <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg"></div>
            ) : (
              data?.energyData && <EnergyChart data={data.energyData} />
            )}
          </div>

          {/* Status Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-orange-500" />
              Current Conditions
            </h2>
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-semibold text-blue-900">{data?.weather.condition}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <span className="text-gray-600">Solar Status</span>
                  <span className="font-semibold text-yellow-900">
                    {currentSolar > 500 ? 'High Production' : currentSolar > 100 ? 'Moderate' : 'Low/None'}
                  </span>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
