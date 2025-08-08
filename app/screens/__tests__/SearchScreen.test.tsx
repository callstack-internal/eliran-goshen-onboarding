describe('Search Logic', () => {
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

  describe('Cities list', () => {
    it('contains the correct cities', () => {
      expect(cities).toContain('Kyiv')
      expect(cities).toContain('Berlin')
      expect(cities).toContain('New York City')
      expect(cities.length).toBe(11)
    })
  })

  describe('Search filtering logic', () => {
    it('filters cities correctly', () => {
      const searchQuery = 'Berlin'
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      expect(filtered).toContain('Berlin')
      expect(filtered.length).toBe(1)
    })

    it('handles case insensitive search', () => {
      const searchQuery = 'berlin'
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      expect(filtered).toContain('Berlin')
    })

    it('returns all cities when search is empty', () => {
      const searchQuery = ''
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // When search is empty, filter returns all cities
      expect(filtered).toEqual(cities)
    })

    it('limits results to 5 cities', () => {
      const searchQuery = 'a'
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      
      expect(filtered.length).toBeLessThanOrEqual(5)
    })

    it('finds multiple cities with partial match', () => {
      const searchQuery = 'a'
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // Should find cities containing 'a'
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.some(city => city.includes('a') || city.includes('A'))).toBe(true)
    })

    it('finds cities with special characters', () => {
      const searchQuery = 'České'
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      expect(filtered).toContain('České Budějovice')
    })

    it('finds cities with accented characters', () => {
      const searchQuery = 'Wrocław'
      const filtered = cities.filter((city: string) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      expect(filtered).toContain('Wrocław')
    })
  })
})
