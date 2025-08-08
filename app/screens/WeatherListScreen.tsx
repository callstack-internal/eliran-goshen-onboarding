import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { Screen } from '@/components/Screen'
import { useWeatherQuery, formatTemperature, formatWeatherDescription, getWeatherIconUrl } from '@/query/queries'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigators/AppNavigator'
import { useCities } from '@/hooks/useCities'

interface WeatherListItemProps {
  item: string
  onPress: () => void
}

const WeatherListItem: React.FC<WeatherListItemProps> = ({ item, onPress }) => {
  console.log('WeatherListItem rendering for city:', item) // Debug log
  const { data: weatherData, isLoading } = useWeatherQuery(item)

  if (isLoading || !weatherData) {
    return (
      <View style={styles.listItem}>
        <View style={styles.leftSection}>
          <View style={styles.weatherIconPlaceholder} />
          <View style={styles.textSection}>
            <Text style={styles.cityName}>{item}</Text>
            <Text style={styles.weatherStatus}>Loading...</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.temperatureChip}>
            <Text style={styles.temperatureText}>--°F</Text>
          </View>
          <Text style={styles.caretIcon}>›</Text>
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.leftSection}>
        <Image
          source={{ uri: getWeatherIconUrl(weatherData.weather[0]?.icon || '01d') }}
          style={styles.weatherIcon}
        />
        <View style={styles.textSection}>
          <Text style={styles.cityName}>{item}</Text>
          <Text style={styles.weatherStatus}>
            {formatWeatherDescription(weatherData.weather[0]?.description || 'Unknown')}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.temperatureChip}>
          <Text style={styles.temperatureText}>
            {formatTemperature(weatherData.main.temp)}
          </Text>
        </View>
        <Text style={styles.caretIcon}>›</Text>
      </View>
    </TouchableOpacity>
  )
}

export const WeatherListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { cities } = useCities()

  const handleCityPress = (cityName: string) => {
    // Navigate to detailed weather screen with city name
    navigation.navigate('Weather', { city: cityName })
  }

  const handleSearchPress = () => {
    navigation.navigate('Search')
  }

  const renderItem = ({ item }: { item: string }) => {
    return (
      <WeatherListItem
        item={item}
        onPress={() => handleCityPress(item)}
      />
    )
  }

  return (
    <Screen preset="fixed" style={styles.container}>
      <FlatList
        data={cities}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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

  listContainer: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  weatherIconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#e9ecef',
    borderRadius: 25,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
    backgroundColor: 'transparent', // Debug: make sure it's visible
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  weatherStatus: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  temperatureText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  caretIcon: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
}) 