import { formatTemperature, formatWeatherDescription, getWeatherIconUrl } from '../queries'

describe('Weather Queries', () => {
  describe('formatTemperature', () => {
    it('formats temperature correctly', () => {
      expect(formatTemperature(20)).toBe('20°F')
      expect(formatTemperature(0)).toBe('0°F')
      expect(formatTemperature(-5)).toBe('-5°F')
    })

    it('rounds temperature to nearest integer', () => {
      expect(formatTemperature(20.7)).toBe('21°F')
      expect(formatTemperature(20.3)).toBe('20°F')
    })
  })

  describe('formatWeatherDescription', () => {
    it('capitalizes first letter of description', () => {
      expect(formatWeatherDescription('clear sky')).toBe('Clear sky')
      expect(formatWeatherDescription('partly cloudy')).toBe('Partly cloudy')
    })
  })

  describe('getWeatherIconUrl', () => {
    it('returns correct icon URL', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png')
      expect(getWeatherIconUrl('02n')).toBe('https://openweathermap.org/img/wn/02n@2x.png')
    })
  })
}) 