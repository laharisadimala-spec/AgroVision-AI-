import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '20.5937';
    const lon = searchParams.get('lon') || '78.9629';

    // Using Open-Meteo for free, no-key weather data
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather');
    
    const data = await res.json();
    const current = data.current;
    
    // Simple weather code mapping
    let condition = "Clear";
    if (current.weather_code >= 1 && current.weather_code <= 3) condition = "Cloudy";
    if (current.weather_code >= 51 && current.weather_code <= 67) condition = "Rainy";
    if (current.weather_code >= 71) condition = "Snowy";

    let advisory = "Conditions are optimal for standard farming activities.";
    if (condition === "Rainy") advisory = "Avoid irrigation today due to expected rainfall. High fungal disease risk.";
    if (current.temperature_2m > 35) advisory = "High heat stress risk. Ensure adequate hydration for crops.";

    const weatherData = {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      condition: condition,
      advisory: advisory,
      forecast: data.daily.time.map((time: string, index: number) => ({
        time: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(data.daily.temperature_2m_max[index]),
        rain: data.daily.precipitation_sum[index]
      })).slice(0, 5)
    };

    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error("Weather fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
