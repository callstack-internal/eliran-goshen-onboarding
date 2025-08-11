import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
// import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
import City from './models/City'
import { schema } from './schema'

// First, create the adapter
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development, see Next steps for more info)
  // migrations: schemaMigrations({
  //   migrations: [
  //     // We'll add migrations here later
  //   ],
  // }),
  // dbName: 'weatherAppDB',
  // onSetUpError: error => {
  //   // Database failed to load -- offer the user to reload the app or log out
  //   console.error(error)
  // }
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    City,
  ],
})
