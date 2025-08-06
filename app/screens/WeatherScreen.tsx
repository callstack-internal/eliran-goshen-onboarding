import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native'
import { Screen } from '@/components/Screen'
import { useWeatherQuery, formatTemperature, formatWeatherDescription, getWeatherIconUrl } from '@/query/queries'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import type { AppStackScreenProps } from '@/navigators/AppNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


export const WeatherScreen: React.FC<AppStackScreenProps<'Weather'>> = (props) => {
  const route = useRoute<RouteProp<{ Weather: { city: string } }, 'Weather'>>()
  const navigation = useNavigation()
  const [city, setCity] = useState(route.params?.city || 'London')
  const { data: weatherData, isLoading, error, refetch } = useWeatherQuery(city)
  const insets = useSafeAreaInsets()

  

  // Update city when route params change
  useEffect(() => {
    if (route.params?.city) {
      setCity(route.params.city)
    }
  }, [route.params?.city])

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <Screen preset="fixed" style={styles.container}>
      

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Error: {error instanceof Error ? error.message : 'Failed to fetch weather data'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => refetch()}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          
          {weatherData.weather[0] && (
            <View style={styles.weatherInfo}>
              <Image
                source={{ uri: getWeatherIconUrl(weatherData.weather[0].icon) }}
                style={styles.weatherIcon}
              />
              <Text style={styles.temperature}>
                {formatTemperature(weatherData.main.temp)}
              </Text>
              <Text style={styles.description}>
                {formatWeatherDescription(weatherData.weather[0].description)}
              </Text>
            </View>
          )}

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Feels like:</Text>
              <Text style={styles.detailValue}>
                {formatTemperature(weatherData.main.feels_like)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Humidity:</Text>
              <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Wind speed:</Text>
              <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pressure:</Text>
              <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cloud cover:</Text>
              <Text style={styles.detailValue}>{weatherData.clouds.all}%</Text>
            </View>
          </View>
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7cc',
  },
  backButton: {
    padding: 12,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#007AFF',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}) 