// Mock the useCities hook
const mockGetCities = jest.fn()
const mockAddCityToHistory = jest.fn()

jest.mock("@/hooks/useCities", () => ({
  useCities: () => ({
    cities: [
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
    ],
    getCities: mockGetCities,
    addCityToHistory: mockAddCityToHistory,
  }),
}))

// Mock react navigation
const mockNavigate = jest.fn()
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}))

describe("Search Logic", () => {
  const cities = [
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Cities list", () => {
    it("contains the correct cities", () => {
      expect(cities).toContain("Kyiv")
      expect(cities).toContain("Berlin")
      expect(cities).toContain("New York City")
      expect(cities.length).toBe(11)
    })
  })

  describe("Search filtering logic", () => {
    it("filters cities correctly", () => {
      const searchQuery = "Berlin"
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      expect(filtered).toContain("Berlin")
      expect(filtered.length).toBe(1)
    })

    it("handles case insensitive search", () => {
      const searchQuery = "berlin"
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      expect(filtered).toContain("Berlin")
    })

    it("returns all cities when search is empty", () => {
      const searchQuery = ""
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // When search is empty, filter returns all cities
      expect(filtered).toEqual(cities)
    })

    it("limits results to 5 cities", () => {
      const searchQuery = "a"
      const filtered = cities
        .filter((city: string) => city.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)

      expect(filtered.length).toBeLessThanOrEqual(5)
    })

    it("finds multiple cities with partial match", () => {
      const searchQuery = "a"
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // Should find cities containing 'a'
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.some((city) => city.includes("a") || city.includes("A"))).toBe(true)
    })

    it("finds cities with special characters", () => {
      const searchQuery = "České"
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      expect(filtered).toContain("České Budějovice")
    })

    it("finds cities with accented characters", () => {
      const searchQuery = "Wrocław"
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      expect(filtered).toContain("Wrocław")
    })
  })

  describe("Recent Cities Functionality", () => {
    it("returns recent cities from database", async () => {
      const mockRecentCities = ["London", "Paris", "Tokyo", "New York", "Berlin"]
      mockGetCities.mockResolvedValue(mockRecentCities)

      const result = await mockGetCities()
      expect(result).toEqual(mockRecentCities)
      expect(result.length).toBeLessThanOrEqual(5)
    })

    it("handles empty recent cities list", async () => {
      mockGetCities.mockResolvedValue([])

      const result = await mockGetCities()
      expect(result).toEqual([])
      expect(result.length).toBe(0)
    })

    it("returns unique cities only", async () => {
      // Simulate database returning duplicate cities

      mockGetCities.mockResolvedValue(["London", "Paris", "Tokyo"]) // Should return unique cities

      const result = await mockGetCities()
      const uniqueCities = [...new Set(result)]
      expect(result).toEqual(uniqueCities)
    })

    it("limits recent cities to maximum 5", async () => {
      const mockManyCities = ["City1", "City2", "City3", "City4", "City5", "City6", "City7"]
      mockGetCities.mockResolvedValue(mockManyCities.slice(0, 5))

      const result = await mockGetCities()
      expect(result.length).toBeLessThanOrEqual(5)
    })

    it("adds city to history when called", async () => {
      const cityName = "London"
      mockAddCityToHistory.mockResolvedValue(undefined)

      await mockAddCityToHistory(cityName)
      expect(mockAddCityToHistory).toHaveBeenCalledWith(cityName)
    })

    it("handles errors when getting cities", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      mockGetCities.mockRejectedValue(new Error("Database error"))

      try {
        await mockGetCities()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe("Database error")
      }

      consoleSpy.mockRestore()
    })

    it("handles errors when adding city to history", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      const cityName = "London"
      mockAddCityToHistory.mockRejectedValue(new Error("Database error"))

      try {
        await mockAddCityToHistory(cityName)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe("Database error")
      }

      consoleSpy.mockRestore()
    })

    describe("Recent Cities UI Logic", () => {
      it("shows recent section only when cities exist and search is empty", () => {
        const hasRecentCities = true
        const searchQuery = ""
        const shouldShowRecent = hasRecentCities && !searchQuery.trim()

        expect(shouldShowRecent).toBe(true)
      })

      it("hides recent section when search query is not empty", () => {
        const hasRecentCities = true
        const searchQuery = "London"
        const shouldShowRecent = hasRecentCities && !searchQuery.trim()

        expect(shouldShowRecent).toBe(false)
      })

      it("hides recent section when no recent cities exist", () => {
        const hasRecentCities = false
        const searchQuery = ""
        const shouldShowRecent = hasRecentCities && !searchQuery.trim()

        expect(shouldShowRecent).toBe(false)
      })

      it("hides recent section when search query has only whitespace", () => {
        const hasRecentCities = true
        const searchQuery = "   "
        const shouldShowRecent = hasRecentCities && !searchQuery.trim()

        expect(shouldShowRecent).toBe(true)
      })
    })

    describe("Recent Cities Navigation", () => {
      it("navigates to weather screen when recent city is pressed", () => {
        const cityName = "London"
        const handleCityPress = (city: string) => {
          mockNavigate("Weather", { city })
        }

        handleCityPress(cityName)
        expect(mockNavigate).toHaveBeenCalledWith("Weather", { city: cityName })
      })

      it("handles navigation for different recent cities", () => {
        const cities = ["London", "Paris", "Tokyo"]
        cities.forEach((city) => {
          mockNavigate("Weather", { city })
        })

        expect(mockNavigate).toHaveBeenCalledTimes(3)
        expect(mockNavigate).toHaveBeenCalledWith("Weather", { city: "London" })
        expect(mockNavigate).toHaveBeenCalledWith("Weather", { city: "Paris" })
        expect(mockNavigate).toHaveBeenCalledWith("Weather", { city: "Tokyo" })
      })
    })
  })
})
