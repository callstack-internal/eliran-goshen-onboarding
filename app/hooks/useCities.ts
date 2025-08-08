import { useMemo } from 'react'

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

export const useCities = () => {
  const citiesList = useMemo(() => cities, [])

  return {
    cities: citiesList,
  }
}
