import { useState, useEffect } from 'react';
import { DashboardDataPoint } from '@/types/dashboard';
import { generateCorrelationData } from '@/lib/normalize';
import { MOCK_WEATHER_DATA, WeatherData } from '@/lib/api/mockData';

interface DashboardData {
    weather: WeatherData;
    energyData: DashboardDataPoint[];
}

export function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Simulate Promise.all for multiple data sources
                const [weather, energyData] = await Promise.all([
                    new Promise<WeatherData>((resolve) =>
                        setTimeout(() => resolve(MOCK_WEATHER_DATA), 1000)
                    ),
                    new Promise<DashboardDataPoint[]>((resolve) =>
                        setTimeout(() => resolve(generateCorrelationData()), 1500)
                    )
                ]);

                setData({
                    weather,
                    energyData
                });
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
}
