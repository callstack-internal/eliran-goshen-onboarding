import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native'
import { Screen } from '@/components/Screen'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigators/AppNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '@/components/Icon'
import { useCities } from '@/hooks/useCities'

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [searchQuery, setSearchQuery] = useState('')
  const insets = useSafeAreaInsets()
  const { cities } = useCities()

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
      
      <FlatList
        data={filteredCities}
        renderItem={renderCityItem}
        keyExtractor={(item) => item}
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
})
