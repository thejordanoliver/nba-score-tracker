import { useEffect, useState } from "react";

export type WeatherData = {
  tempFahrenheit: number;  // changed
  description: string;
  icon: string;
  cityName: string;
  datetime: string; // forecast datetime
};

export function useWeatherForecast(
  lat: number | null,
  lon: number | null,
  gameDateStr: string | null
) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon || !gameDateStr) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = "09f079f11f3ea22e5846e249da888468";
        // Keep units metric to get Celsius, then convert manually
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch weather forecast");
        }
        const data = await response.json();

        const gameTimestamp = new Date(gameDateStr).getTime();

        let closestForecast = data.list[0];
        let minDiff = Math.abs(gameTimestamp - closestForecast.dt * 1000);

        for (const forecast of data.list) {
          const forecastTimestamp = forecast.dt * 1000;
          const diff = Math.abs(gameTimestamp - forecastTimestamp);
          if (diff < minDiff) {
            minDiff = diff;
            closestForecast = forecast;
          }
        }

        // Convert Celsius to Fahrenheit
        const tempFahrenheit = closestForecast.main.temp * 9/5 + 32;

        setWeather({
          tempFahrenheit,
          description: closestForecast.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${closestForecast.weather[0].icon}@2x.png`,
          cityName: data.city.name,
          datetime: closestForecast.dt_txt,
        });
      } catch (err: any) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon, gameDateStr]);

  return { weather, loading, error };
}
