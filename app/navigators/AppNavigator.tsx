/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { ComponentProps } from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { SearchScreen } from "@/screens/SearchScreen"
import { WeatherListScreen } from "@/screens/WeatherListScreen"
import { WeatherScreen } from "@/screens/WeatherScreen"
import { useAppTheme } from "@/theme/context"

// import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { navigationRef } from "./navigationUtilities"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  WeatherList: undefined
  Weather: { city: string }
  Search: undefined
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="WeatherList"
    >
      <>
        <Stack.Screen
          name="WeatherList"
          component={WeatherListScreen}
          options={({ navigation }) => ({
            title: "Weather",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Search")}
                style={styles.searchButton}
              >
                <MaterialIcons name="search" size={24} color="#007AFF" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Weather" component={WeatherScreen} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />

        {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
      </>

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  searchButton: {
    marginRight: 16,
  },
})

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={"dev"}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
