import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "welcome",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({});
  const router = useRouter();
  const { hasSeenWelcome } = useUserStore();
  const [appError, setAppError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      setAppError(error);
    }
  }, [error]);

  useEffect(() => {
    const hideSpashAndNavigate = async () => {
      try {
        if (loaded) {
          await SplashScreen.hideAsync();
          
          // If user has seen welcome screen, redirect to main app
          if (hasSeenWelcome) {
            router.replace('/(tabs)');
          }
        }
      } catch (e) {
        console.error("Navigation error:", e);
        setAppError(e instanceof Error ? e : new Error(String(e)));
      }
    };

    hideSpashAndNavigate();
  }, [loaded, hasSeenWelcome, router]);

  if (appError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{appError.message}</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.danger,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  }
});