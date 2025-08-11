import { useQuery } from '@tanstack/react-query'
import { WeatherData } from './types'

// Query keys for React Query
export const weatherQueryKeys = {
  all: ['weather'] as const,
  byCity: (city: string) => [...weatherQueryKeys.all, 'city', city] as const,
}



// Custom hook for fetching weather data
export const useWeatherQuery = (city: string) => {
    // Fetch weather data function
const fetchWeatherData = async (city: string): Promise<WeatherData> => {
    const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    return response.json()
  }
  return useQuery({
    queryKey: weatherQueryKeys.byCity(city),
    queryFn: () => fetchWeatherData(city),
    enabled: !!city, // Only run query if city is provided
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
}

// Helper function to get weather icon URL
export const getWeatherIconUrl = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
