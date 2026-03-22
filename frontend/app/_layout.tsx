import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { Loading } from "@/components/Loading";
import { Toast } from "@/components/Toast";
import { useBootstrap } from "@/hooks/useBootstrap";
import { useAuthStore } from "@/store/authStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

const queryClient = new QueryClient();

export default function RootLayout() {
  useBootstrap();
  const { accessToken, hydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (!hydrated) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!accessToken && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
    if (accessToken && inAuthGroup) {
      router.replace("/(tabs)/dashboard");
    }
  }, [accessToken, hydrated, router, segments]);

  if (!hydrated) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          }}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="accounts/new"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="accounts/[id]"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="transactions/new"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="transactions/[id]"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
      <Toast />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
