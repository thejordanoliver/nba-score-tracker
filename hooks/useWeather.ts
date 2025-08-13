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
    if (!lat || !lon || !gameDateStr) {
      console.warn("Weather hook skipped due to missing inputs:", {
        lat,
        lon,
        gameDateStr,
      });
      return;
    }

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
          console.error("Weather API HTTP error:", response.status, response.statusText);
          throw new Error("Failed to fetch weather forecast");
        }

        const data = await response.json();

        if (!data.list || data.list.length === 0) {
          throw new Error("No forecast data returned for this location");
        }

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

        console.log("Parsed weather data:", freshWeather);

        await AsyncStorage.setItem(cacheKey, JSON.stringify(freshWeather));

        if (isActive) {
          setWeather(freshWeather);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Weather fetch error:", err);
        if (isActive) {
          setError(err.message);
          setWeather(null);
          setLoading(false);
        }
      }
    };

    const loadCachedThenFetch = async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          console.log("Weather cache hit:", cacheKey);
          const cachedData: WeatherData = JSON.parse(cached);
          if (isActive) {
            setWeather(cachedData);
            setLoading(false);
          }
        } else {
          console.log("Weather cache miss:", cacheKey);
          setLoading(true);
        }
      } catch (err: any) {
        console.error("Weather cache read error:", err);
        if (isActive) {
          setError(err.message);
          setWeather(null);
          setLoading(false);
        }
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
