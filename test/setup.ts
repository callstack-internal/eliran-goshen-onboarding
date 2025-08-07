// we always make sure 'react-native' gets included first
// eslint-disable-next-line no-restricted-imports
import * as ReactNative from "react-native"

import mockFile from "./mockFile"

import "react-native-gesture-handler/jestSetup"

// Mock react-native-keyboard-controller
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: "KeyboardAwareScrollView",
}))

// Mock react-native-edge-to-edge
jest.mock("react-native-edge-to-edge", () => ({
  SystemBars: "SystemBars",
}))

// Mock expo-image
jest.mock("expo-image", () => ({
  Image: "Image",
}))

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

// Mock the Screen component
jest.mock("@/components/Screen", () => ({
  Screen: ({ children, ...props }: any) => children,
}))

// Mock fetch for API tests
global.fetch = jest.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// libraries to mock
jest.doMock("react-native", () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      Image: {
        ...ReactNative.Image,
        resolveAssetSource: jest.fn((_source) => mockFile), // eslint-disable-line @typescript-eslint/no-unused-vars
        getSize: jest.fn(
          (
            uri: string, // eslint-disable-line @typescript-eslint/no-unused-vars
            success: (width: number, height: number) => void,
            failure?: (_error: any) => void, // eslint-disable-line @typescript-eslint/no-unused-vars
          ) => success(100, 100),
        ),
      },
    },
    ReactNative,
  )
})

jest.mock("i18next", () => ({
  currentLocale: "en",
  t: (key: string, params: Record<string, string>) => {
    return `${key} ${JSON.stringify(params)}`
  },
  translate: (key: string, params: Record<string, string>) => {
    return `${key} ${JSON.stringify(params)}`
  },
}))

jest.mock("expo-localization", () => ({
  ...jest.requireActual("expo-localization"),
  getLocales: () => [{ languageTag: "en-US", textDirection: "ltr" }],
}))

jest.mock("../app/i18n/index.ts", () => ({
  i18n: {
    isInitialized: true,
    language: "en",
    t: (key: string, params: Record<string, string>) => {
      return `${key} ${JSON.stringify(params)}`
    },
    numberToCurrency: jest.fn(),
  },
}))

declare const tron // eslint-disable-line @typescript-eslint/no-unused-vars

declare global {
  let __TEST__: boolean
}
