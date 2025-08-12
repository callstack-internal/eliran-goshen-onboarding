import { useState, useMemo, useEffect, useCallback } from "react"
// eslint-disable-next-line no-restricted-imports
import { View, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useCities } from "@/hooks/useCities"
import type { AppStackParamList } from "@/navigators/AppNavigator"

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [searchQuery, setSearchQuery] = useState("")
  const [recentCities, setRecentCities] = useState<string[]>([])
  const insets = useSafeAreaInsets()
  const { cities, getCities } = useCities()

  const loadRecentCities = useCallback(async () => {
    const recent = await getCities()
    setRecentCities(recent)
  }, [getCities])

  // Load recent cities on mount
  useEffect(() => {
    loadRecentCities()
  }, [loadRecentCities])

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return [] // Show no cities when search is empty
    }

    const filtered = cities.filter((city: string) =>
      city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return filtered.slice(0, 5) // Limit to 5 results
  }, [searchQuery, cities])

  const handleCityPress = (cityName: string) => {
    navigation.navigate("Weather", { city: cityName })
  }

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.cityItem} onPress={() => handleCityPress(item)}>
      <Text style={styles.cityText}>{item}</Text>
    </TouchableOpacity>
  )

  const renderRecentCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.cityItem} onPress={() => handleCityPress(item)}>
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
          {/* eslint-disable-next-line no-restricted-imports */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search cities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
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
  backIcon: {
    marginRight: 12,
  },
  cityItem: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cityText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  clearIcon: {
    marginLeft: 8,
  },
  container: {
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    borderBottomColor: "#e9ecef",
    borderBottomWidth: 1,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  historyIcon: {
    color: "#666",
    marginRight: 12,
  },
  listContainer: {
    padding: 16,
  },
  recentItemContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  recentListContainer: {
    paddingBottom: 8,
  },
  recentSection: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    color: "#333",
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
})
