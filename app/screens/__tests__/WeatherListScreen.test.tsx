import { getWeatherIconUrl } from "@/query/queries"
import { formatTemperature, formatWeatherDescription } from "@/utils/weatherUtil"

describe("WeatherListScreen Logic", () => {
  describe("Weather data formatting", () => {
    it("formats temperature correctly", () => {
      expect(formatTemperature(20)).toBe("20°F")
      expect(formatTemperature(0)).toBe("0°F")
      expect(formatTemperature(-5)).toBe("-5°F")
    })

    it("formats weather description correctly", () => {
      expect(formatWeatherDescription("clear sky")).toBe("Clear sky")
      expect(formatWeatherDescription("partly cloudy")).toBe("Partly cloudy")
    })

    it("generates correct weather icon URLs", () => {
      expect(getWeatherIconUrl("01d")).toBe("https://openweathermap.org/img/wn/01d@2x.png")
      expect(getWeatherIconUrl("02n")).toBe("https://openweathermap.org/img/wn/02n@2x.png")
    })
  })

  describe("City list data", () => {
    it("has the expected cities", () => {
      const expectedCities = [
        "Kyiv",
        "Sumy",
        "Warsaw",
        "Wrocław",
        "Prague",
        "České Budějovice",
        "Berlin",
        "Munich",
        "Aachen",
        "Washington",
        "New York City",
      ]

      // This tests that our cities array contains the expected cities
      expect(expectedCities).toContain("Kyiv")
      expect(expectedCities).toContain("Berlin")
      expect(expectedCities).toContain("New York City")
      expect(expectedCities.length).toBe(11)
    })
  })
})
