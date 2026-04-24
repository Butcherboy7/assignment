import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import theme from "../theme";

const LoadingScreen = ({ text }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    {text ? <Text style={styles.text}>{text}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: theme.spacing.md,
    color: theme.colors.subtext,
    fontSize: theme.fontSize.md,
  },
});

export default LoadingScreen;
