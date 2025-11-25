export interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
}

export interface EnergyData {
    currentIntensity: number; // gCO2/kWh
    forecast: {
        time: string;
        intensity: number;
    }[];
    source: string;
}

export interface DashboardData {
    weather: WeatherData;
    energy: EnergyData;
}

export const MOCK_WEATHER_DATA: WeatherData = {
    temperature: 22,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 12,
};

export const MOCK_ENERGY_DATA: EnergyData = {
    currentIntensity: 180,
    source: 'Mixed',
    forecast: [
        { time: '10:00', intensity: 175 },
        { time: '11:00', intensity: 185 },
        { time: '12:00', intensity: 200 },
        { time: '13:00', intensity: 190 },
        { time: '14:00', intensity: 160 },
        { time: '15:00', intensity: 150 },
    ],
};
