// Helper function to format temperature
export const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°F`
  }
  
  // Helper function to format weather description
  export const formatWeatherDescription = (description: string) => {
    return description.charAt(0).toUpperCase() + description.slice(1)
  }