import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Safe fallback returned when the weather API is unreachable. */
const FALLBACK_WEATHER = {
  temperature: 28,
  humidity: 65,
  windSpeed: 12,
  condition: 'Clear',
  advisory: 'Weather data is temporarily unavailable. Conditions are estimated — check again soon.',
  forecast: [
    { time: 'Mon', temp: 28, rain: 0 },
    { time: 'Tue', temp: 27, rain: 2 },
    { time: 'Wed', temp: 29, rain: 0 },
    { time: 'Thu', temp: 26, rain: 5 },
    { time: 'Fri', temp: 30, rain: 0 },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '20.5937';
    const lon = searchParams.get('lon') || '78.9629';

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&timezone=auto`;

    // Apply a 10-second timeout so a slow upstream never blocks the page.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    let res: Response;
    try {
      res = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      console.error(`[weather] Upstream returned ${res.status}: ${res.statusText}`);
      return NextResponse.json(FALLBACK_WEATHER);
    }

    const data = await res.json().catch(() => null);

    if (!data || !data.current || !data.daily) {
      console.error('[weather] Upstream returned malformed data');
      return NextResponse.json(FALLBACK_WEATHER);
    }

    const current = data.current;

    let condition = 'Clear';
    if (current.weather_code >= 1 && current.weather_code <= 3) condition = 'Cloudy';
    if (current.weather_code >= 51 && current.weather_code <= 67) condition = 'Rainy';
    if (current.weather_code >= 71) condition = 'Snowy';

    let advisory = 'Conditions are optimal for standard farming activities.';
    if (condition === 'Rainy')
      advisory = 'Avoid irrigation today due to expected rainfall. High fungal disease risk.';
    if (current.temperature_2m > 35)
      advisory = 'High heat stress risk. Ensure adequate hydration for crops.';

    const weatherData = {
      temperature: Math.round(current.temperature_2m ?? 0),
      humidity: current.relative_humidity_2m ?? 0,
      windSpeed: Math.round(current.wind_speed_10m ?? 0),
      condition,
      advisory,
      forecast: (data.daily.time as string[])
        .map((time: string, index: number) => ({
          time: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round((data.daily.temperature_2m_max?.[index] as number) ?? 0),
          rain: (data.daily.precipitation_sum?.[index] as number) ?? 0,
        }))
        .slice(0, 5),
    };

    return NextResponse.json(weatherData);
  } catch (error: unknown) {
    const message = (error as any)?.message ?? String(error);

    // AbortError means the request timed out — return fallback, not an error status.
    if ((error as any)?.name === 'AbortError') {
      console.warn('[weather] Request timed out — returning fallback data');
    } else {
      console.error('[weather] Unexpected error:', message);
    }

    // Always return fallback data so the UI never crashes on weather failure.
    return NextResponse.json(FALLBACK_WEATHER);
  }
}
