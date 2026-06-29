import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import type { WeatherData } from "../types/interface/weather.app.interface";

type FormInputType = {
  CityName: string;
};

const weatherAppSchema = yup.object({
  CityName: yup.string().required("city name is required"),
});

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";

const WeatherApp = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputType>({
    resolver: yupResolver(weatherAppSchema),
    defaultValues: {
      CityName: "",
    },
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("Weather:", weather);

  const fetchWeather = async (cityname: string) => {
    if (!API_KEY) {
      setError("Add your OpenWeatherMap API key to .env.local");
      return;
    }
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const url = `${API_BASE}?q=${encodeURIComponent(cityname)}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      console.log(response);

      if (response.status === 404) {
        setError("City not found");
        return;
      }

      if (response.status < 200 || response.status >= 300) {
        setError("Something went wrong. Please try again");
        return;
      }

      setWeather(response.data as WeatherData);
    } catch (error: any) {
      setError(`Error: ${error?.message ?? String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: FormInputType) => {
    console.log("Weather-App-Data :", data);
    const trimmed = data.CityName.trim();
    fetchWeather(trimmed);

    reset();
  };

  const iconUrl = weather?.weather[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null;
  return (
    <>
      <Typography
        variant="h3"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Weather App
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Controller
          name="CityName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="CityName"
              placeholder="Enter City Name"
              error={!!errors.CityName}
              helperText={errors?.CityName?.message}
            />
          )}
        />

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Searching..." : "Search"}
        </Button>
      </Box>
      <div className="min-h-[200px] flex items-center justify-center">
        {loading && (
          <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
        )}

        {!loading && error && (
          <p className="text-lg text-red-600 font-medium text-center">
            {error}
          </p>
        )}

        {!loading && !error && weather && (
          <div className="text-center w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {weather.name}
            </h2>

            {iconUrl && (
              <img
                src={iconUrl}
                alt={weather.weather[0].description}
                className="w-24 h-24 mx-auto"
              />
            )}

            <p className="text-5xl font-bold text-gray-900 my-2">
              {Math.round(weather.main.temp)}°C
            </p>

            <p className="text-lg text-gray-600 capitalize">
              {weather.weather[0].description}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {weather.weather[0].main}
            </p>

            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
              <span>Feels like {Math.round(weather.main.feels_like)}°C</span>

              <span>Humidity {weather.main.humidity}%</span>

              <span>Wind {weather.wind.speed} m/s</span>
            </div>
          </div>
        )}

        {!loading && !error && !weather && (
          <p className="text-gray-500 text-center">
            Search for a city to see the weather
          </p>
        )}
      </div>
    </>
  );
};

export default WeatherApp;
