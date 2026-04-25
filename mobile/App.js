import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#0F172A" />
        <AppNavigator />
      </AuthProvider>
      {/* Toast must be last child to render above all navigation layers */}
      <Toast bottomOffset={80} />
    </SafeAreaProvider>
  );
}
