import { DashboardDataPoint } from '@/types/dashboard';

export function generateCorrelationData(): DashboardDataPoint[] {
    const data: DashboardDataPoint[] = [];
    const startHour = 6;
    const endHour = 22;

    for (let hour = startHour; hour <= endHour; hour++) {
        const timestamp = `${hour.toString().padStart(2, '0')}:00`;
        let solarOutput = 0;
        let carbonIntensity = 250; // Base intensity
        const isForecast = hour > new Date().getHours(); // Simple forecast logic

        // Morning (06:00 - 12:00): Solar UP, Carbon DOWN
        if (hour >= 6 && hour <= 12) {
            const progress = (hour - 6) / 6; // 0 to 1
            solarOutput = Math.round(progress * 800);
            carbonIntensity = Math.round(250 - (progress * 100)); // 250 -> 150
        }
        // Afternoon (12:00 - 17:00): Peak Solar, Low Carbon
        else if (hour > 12 && hour < 17) {
            solarOutput = 800 - Math.round(((hour - 12) / 5) * 200); // Slight dip
            carbonIntensity = 150 + Math.round(((hour - 12) / 5) * 20); // Slight rise
        }
        // Evening (17:00 - 22:00): Solar DOWN, Carbon UP
        else if (hour >= 17) {
            const progress = (hour - 17) / 5; // 0 to 1
            solarOutput = Math.max(0, Math.round(600 - (progress * 600))); // Drop to 0
            carbonIntensity = Math.round(170 + (progress * 130)); // Spike back up to ~300
        }

        // Add some random noise
        solarOutput = Math.max(0, solarOutput + (Math.random() * 50 - 25));
        carbonIntensity = Math.max(0, carbonIntensity + (Math.random() * 20 - 10));

        data.push({
            timestamp,
            carbonIntensity: Math.round(carbonIntensity),
            solarOutput: Math.round(solarOutput),
            isForecast
        });
    }

    return data;
}
