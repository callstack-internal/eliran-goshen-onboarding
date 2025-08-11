import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native'
import { Screen } from '@/components/Screen'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigators/AppNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '@/components/Icon'
import { useCities } from '@/hooks/useCities'
import { MaterialIcons } from '@expo/vector-icons'

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentCities, setRecentCities] = useState<string[]>([])
  const insets = useSafeAreaInsets()
  const { cities, getCities } = useCities()

  // Load recent cities on mount
  useEffect(() => {
    loadRecentCities()
  }, [])

  const loadRecentCities = async () => {
    const recent = await getCities()
    setRecentCities(recent)
  }

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return [] // Show no cities when search is empty
    }
    
    const filtered = cities.filter((city: string) =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return filtered.slice(0, 5) // Limit to 5 results
  }, [searchQuery, cities])

  const handleCityPress = (cityName: string) => {
    navigation.navigate('Weather', { city: cityName })
  }

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.cityItem} 
      onPress={() => handleCityPress(item)}
    >
      <Text style={styles.cityText}>{item}</Text>
    </TouchableOpacity>
  )

  const renderRecentCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.cityItem} 
      onPress={() => handleCityPress(item)}
    >
      <View style={styles.recentItemContent}>
    <MaterialIcons name="history" size={20} style={styles.historyIcon} />
        <Text style={styles.cityText}>{item}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <Screen preset="fixed" style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon icon="back" size={24} style={styles.backIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon icon="x" size={20} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Recent Cities Section */}
      {recentCities.length > 0 && !searchQuery.trim() && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <FlatList
            data={recentCities}
            renderItem={renderRecentCityItem}
            keyExtractor={(item) => `recent-${item}`}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.recentListContainer}
          />
        </View>
      )}
      
      {/* Search Results */}
      <FlatList
        data={filteredCities}
        renderItem={renderCityItem}
        keyExtractor={(item) => `search-${item}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  cityItem: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cityText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recentListContainer: {
    paddingBottom: 8,
  },
  historyIcon: {
    marginRight: 12,
    color: '#666',
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
