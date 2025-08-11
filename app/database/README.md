# WatermelonDB Database Setup

This project uses WatermelonDB for local data persistence. The database is set up with a simple City model.

## Structure

- `index.ts` - Main database configuration and instance
- `schema.ts` - Database schema definition
- `models/City.ts` - City model with a single `city` field
- `DatabaseProvider.tsx` - React context provider for the database
- `models/index.ts` - Export file for all models

## City Model

The City model contains:
- `city` (string) - The name of the city
- `createdAt` (number) - Timestamp when the city was created
- `updatedAt` (number) - Timestamp when the city was last updated

## Usage

### In Components

```tsx
import { useDatabase } from '../database/DatabaseProvider'
import { useObservable } from '@nozbe/watermelondb/hooks'
import City from '../database/models/City'

const MyComponent = () => {
  const database = useDatabase()
  
  // Observe all cities
  const cities = useObservable(
    database.get<City>('cities').query().observe()
  )
  
  // Add a new city
  const addCity = async (cityName: string) => {
    await database.write(async () => {
      await database.get<City>('cities').create((city) => {
        city.city = cityName
      })
    })
  }
  
  // Remove a city
  const removeCity = async (cityId: string) => {
    await database.write(async () => {
      const city = await database.get<City>('cities').find(cityId)
      await city.destroyPermanently()
    })
  }
  
  return (
    // Your component JSX
  )
}
```

### Using the useCities Hook

The `useCities` hook provides a convenient way to work with cities:

```tsx
import { useCities } from '../hooks/useCities'

const MyComponent = () => {
  const { cities, addCity, removeCity, searchCities } = useCities()
  
  // cities is an observable array of City objects
  // addCity(cityName) adds a new city
  // removeCity(cityId) removes a city
  // searchCities(query) searches for cities by name
}
```

## Database Operations

All database operations must be wrapped in a `database.write()` call:

```tsx
await database.write(async () => {
  // Create, update, or delete operations go here
})
```

## Observables

WatermelonDB uses observables for reactive data. Use the `useObservable` hook to subscribe to data changes:

```tsx
const cities = useObservable(
  database.get<City>('cities').query().observe()
)
```

## Queries

You can query the database using the Q object:

```tsx
import { Q } from '@nozbe/watermelondb'

// Find cities containing "York"
const cities = database.get<City>('cities')
  .query(Q.where('city', Q.like('%York%')))
  .observe()
```
