'use client';
import React, { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TopNavbar, CITIES } from '@/components/dashboard/TopNavbar';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { EnergyMixCard } from '@/components/dashboard/EnergyMixCard';
import { InferenceHealthCard } from '@/components/dashboard/InferenceHealthCard';
import { LiveTelemetryChart } from '@/components/dashboard/LiveTelemetryChart';
import { EnvironmentPanel } from '@/components/dashboard/EnvironmentPanel';
import { EnergyChart } from '@/components/dashboard/EnergyChart';
import { MapPin, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const { data, loading, error } = useDashboardData(selectedCity.coords);

  const currentHour = new Date().getHours();
  const currentEnergy = data?.energyData.find(d => {
    const date = new Date(d.timestamp);
    return date.getHours() === currentHour;
  }) || data?.energyData[0];

  // Calculate KPI values
  const peakToday = data?.energyData ? Math.max(...data.energyData.map(d => d.solarOutput || 0)) : 0;
  const avgAQI = data?.energyData ? data.energyData.reduce((a, d) => a + (d.airQualityIndex || 0), 0) / data.energyData.length : 0;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-6 rounded-xl card max-w-sm">
          <span className="text-2xl mb-3 block">⚠️</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Connection Error</h2>
          <p className="text-xs text-slate-500">Failed to load data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Navigation with AI Insights Modal Trigger */}
      <TopNavbar
        cities={CITIES}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        solarOutput={currentEnergy?.solarOutput ?? 0}
        temperature={data?.weather.temperature ?? 0}
      />

      {/* Main Content - Compact, Above-the-Fold Layout */}
      <main className="pt-20 pb-4 px-4 lg:px-6 max-w-[1920px] mx-auto">

        {/* Page Header */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
            <MapPin className="w-3 h-3" />
            <span>{selectedCity.coords.lat.toFixed(2)}, {selectedCity.coords.long.toFixed(2)}</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCity.name} <span className="text-teal-600 dark:text-teal-400">Energy Dashboard</span>
          </h1>
        </div>

        {/* ROW 1: Hero Section - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
          {/* Left Column: AI Forecast + Energy Correlation */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <AIInsightCard />
            {/* Energy Correlation Card */}
            <div className="card p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Energy Correlation</h3>
                  <p className="text-xs text-slate-400">AQI vs Solar Output</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>AQI
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>Solar
                </span>
              </div>
              <div className="flex-1 min-h-[200px]">
                <EnergyChart data={data?.energyData || []} mode="combined" className="h-full" />
              </div>
            </div>
          </div>

          {/* Middle Column: Sustainability Intelligence + Inference Health */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <EnergyMixCard
              solarOutput={currentEnergy?.solarOutput ?? 0}
              gridUsage={Math.max(0, (currentEnergy?.solarOutput ?? 0) * 2.5 - (currentEnergy?.solarOutput ?? 0))}
              peakToday={peakToday}
              avgAQI={avgAQI}
              className="flex-1"
            />
            <InferenceHealthCard />
          </div>

          {/* Right Column: Environment */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <EnvironmentPanel
              temperature={data?.weather.temperature ?? 0}
              humidity={data?.weather.humidity ?? 0}
              windSpeed={data?.weather.windSpeed ?? 0}
              uvIndex={currentEnergy?.uvIndex ?? 0}
              forecast={data?.forecast ?? []}
            />
          </div>
        </div>

        {/* ROW 2: Live Telemetry - Full Width */}
        <div className="grid grid-cols-1 gap-3">
          <LiveTelemetryChart />
        </div>

      </main>
    </div>
  );
}
