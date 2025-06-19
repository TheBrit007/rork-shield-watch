import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  initialRouteName: "welcome",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({});
  const router = useRouter();
  const { hasSeenWelcome } = useUserStore();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      
      // If user has seen welcome screen, redirect to main app
      if (hasSeenWelcome) {
        router.replace('/(tabs)');
      }
    }
  }, [loaded, hasSeenWelcome]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="report/[id]" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Report Details',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            presentation: 'modal',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            presentation: 'modal',
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}