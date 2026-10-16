import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/weather
 * Real weather via Open-Meteo (https://open-meteo.com) — free, no API key.
 * Body: { city?: string, latitude?: number, longitude?: number }
 */

const CITY_COORDS: Record<string, { lat: number; lon: number; label: string }> = {
  lima: { lat: -12.0464, lon: -77.0428, label: "Lima, Perú" },
  cusco: { lat: -13.5319, lon: -71.9675, label: "Cusco, Perú" },
  arequipa: { lat: -16.409, lon: -71.5375, label: "Arequipa, Perú" },
  bogota: { lat: 4.711, lon: -74.0721, label: "Bogotá, Colombia" },
  "mexico city": { lat: 19.4326, lon: -99.1332, label: "Ciudad de México" },
  "ciudad de mexico": { lat: 19.4326, lon: -99.1332, label: "Ciudad de México" },
  madrid: { lat: 40.4168, lon: -3.7038, label: "Madrid, España" },
  "buenos aires": { lat: -34.6037, lon: -58.3816, label: "Buenos Aires" },
  santiago: { lat: -33.4489, lon: -70.6693, label: "Santiago, Chile" },
  "new york": { lat: 40.7128, lon: -74.006, label: "New York, USA" },
  tokyo: { lat: 35.6762, lon: 139.6503, label: "Tokyo, Japan" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let lat = typeof body.latitude === "number" ? body.latitude : undefined;
    let lon = typeof body.longitude === "number" ? body.longitude : undefined;
    let label = "Ubicación";

    if (lat === undefined || lon === undefined) {
      const cityRaw = String(body.city || "Lima").trim().toLowerCase();
      const known = CITY_COORDS[cityRaw];
      if (known) {
        lat = known.lat;
        lon = known.lon;
        label = known.label;
      } else {
        // Geocode via Open-Meteo free geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityRaw)}&count=1&language=es&format=json`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.results?.[0]) {
            lat = geo.results[0].latitude;
            lon = geo.results[0].longitude;
            label = `${geo.results[0].name}${geo.results[0].country ? ", " + geo.results[0].country : ""}`;
          }
        }
        if (lat === undefined) {
          lat = -12.0464;
          lon = -77.0428;
          label = "Lima, Perú (fallback)";
        }
      }
    }

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto&forecast_days=5`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Error al consultar Open-Meteo" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const forecast = (daily.time || []).map((date: string, i: number) => ({
      date,
      tempMax: daily.temperature_2m_max?.[i],
      tempMin: daily.temperature_2m_min?.[i],
      precipitationProbability: daily.precipitation_probability_max?.[i],
      weatherCode: daily.weather_code?.[i],
    }));

    return NextResponse.json({
      success: true,
      real: true,
      skill: "weather-intelligence",
      provider: "open-meteo",
      location: { label, latitude: lat, longitude: lon },
      current: {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        units: data.current_units,
      },
      forecast,
    });
  } catch (error) {
    console.error("[weather]", error);
    return NextResponse.json(
      { success: false, error: "Error interno de clima" },
      { status: 500 }
    );
  }
}
