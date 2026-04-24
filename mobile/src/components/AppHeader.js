import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

const AppHeader = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    marginTop: 2,
  },
});

export default AppHeader;
