import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Sembunyikan Splash Screen (Logo) segera setelah komponen dimuat
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
