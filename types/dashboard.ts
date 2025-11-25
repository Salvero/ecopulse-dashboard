export interface DashboardDataPoint {
    timestamp: string;      // "10:00"
    carbonIntensity: number; // gCO2/kWh (The bad stuff)
    solarOutput: number;     // W/m² (The good stuff)
    isForecast: boolean;     // To style future data differently
}
