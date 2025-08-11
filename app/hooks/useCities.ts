import { useMemo } from 'react'
import { database } from '../database'
import { Q } from '@nozbe/watermelondb'
import { City } from '@/database/models'

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

  

  const addCityToHistory = async (cityName: string) => {
    try {
      await database.write(async () => {
        await database.get<City>('cities').create((city) => {
          city.city = cityName
          city.createdAt = Date.now()
          city.updatedAt = Date.now()
        })
      })
      
      
    } catch (error) {
      console.error('Error adding city to history:', error)
    }
  }

  const getCities = async () => {
    try {
      const citiesCollection = database.get<City>('cities')
      const recentCitiesFromDB = await citiesCollection
        .query(Q.sortBy('created_at', Q.desc), Q.take(20)) // Take more to ensure we get enough unique cities
        .fetch()
      
      // Filter unique cities, keeping the most recent occurrence of each
      const uniqueCities = recentCitiesFromDB.reduce((acc: string[], city) => {
        if (!acc.includes(city.city)) {
          acc.push(city.city)
        }
        return acc
      }, [])
      
      // Take only the first 5 unique cities
      const cityNames = uniqueCities.slice(0, 5)
      return cityNames
    } catch (error) {
      console.error('Error getting cities from database:', error)
      return []
    }
  }

  return {
    cities: citiesList,
    addCityToHistory,
    getCities,
  }
}
