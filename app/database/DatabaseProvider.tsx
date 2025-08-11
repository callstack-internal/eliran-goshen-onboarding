import React, { createContext, useContext } from 'react'
import { Database } from '@nozbe/watermelondb'
import { database } from './index'

const DatabaseContext = createContext<Database | null>(null)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = () => {
  const database = useContext(DatabaseContext)
  if (!database) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return database
}
