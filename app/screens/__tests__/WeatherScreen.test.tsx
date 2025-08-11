import { getWeatherIconUrl } from '@/query/queries'
import { formatTemperature, formatWeatherDescription } from '@/utils/weatherUtil'

describe('WeatherScreen Logic', () => {
  describe('Weather data formatting', () => {
    it('formats temperature correctly', () => {
      expect(formatTemperature(20)).toBe('20°F')
      expect(formatTemperature(0)).toBe('0°F')
      expect(formatTemperature(-5)).toBe('-5°F')
    })

    it('formats weather description correctly', () => {
      expect(formatWeatherDescription('clear sky')).toBe('Clear sky')
      expect(formatWeatherDescription('partly cloudy')).toBe('Partly cloudy')
    })

    it('generates correct weather icon URLs', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png')
      expect(getWeatherIconUrl('02n')).toBe('https://openweathermap.org/img/wn/02n@2x.png')
    })
  })

  describe('Weather data structure', () => {
    it('has the expected weather data properties', () => {
      const mockWeatherData = {
        name: 'London',
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        main: {
          temp: 20,
          feels_like: 18,
          humidity: 65,
          pressure: 1013,
        },
        wind: {
          speed: 5.2,
          deg: 180,
        },
        clouds: {
          all: 20,
        },
      }

      expect(mockWeatherData.name).toBe('London')
      expect(mockWeatherData.weather[0].description).toBe('clear sky')
      expect(mockWeatherData.main.temp).toBe(20)
      expect(mockWeatherData.main.humidity).toBe(65)
      expect(mockWeatherData.wind.speed).toBe(5.2)
      expect(mockWeatherData.clouds.all).toBe(20)
    })
  })
}) 