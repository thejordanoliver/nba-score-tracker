import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type WeatherData = {
  tempFahrenheit: number;
  description: string;
  icon: string;
  cityName: string;
  datetime: string; // forecast datetime
};

const getWeatherCacheKey = (lat: number, lon: number, dateStr: string) =>
  `weather_${lat}_${lon}_${dateStr}`;

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

    const cacheKey = getWeatherCacheKey(lat, lon, gameDateStr);

    let isActive = true;

    const fetchAndCacheWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = "09f079f11f3ea22e5846e249da888468";
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

        const tempFahrenheit = closestForecast.main.temp * (9 / 5) + 32;

        const freshWeather: WeatherData = {
          tempFahrenheit,
          description: closestForecast.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${closestForecast.weather[0].icon}@2x.png`,
          cityName: data.city.name,
          datetime: closestForecast.dt_txt,
        };

        await AsyncStorage.setItem(cacheKey, JSON.stringify(freshWeather));

        if (isActive) {
          setWeather(freshWeather);
          setLoading(false);
        }
      } catch (err: any) {
        if (isActive) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    const loadCachedThenFetch = async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const cachedData: WeatherData = JSON.parse(cached);
          if (isActive) {
            setWeather(cachedData);
            setLoading(false);
          }
        } else {
          setLoading(true);
        }
      } catch {
        // ignore cache read errors
      }

      // Fetch fresh in background regardless
      fetchAndCacheWeather();
    };

    loadCachedThenFetch();

    return () => {
      isActive = false;
    };
  }, [lat, lon, gameDateStr]);

  return { weather, loading, error };
}
