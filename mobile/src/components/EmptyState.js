import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

const EmptyState = ({ icon = "document-outline", title, subtitle }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={48} color={theme.colors.subtext} />
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    marginTop: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.subtext,
    fontSize: theme.fontSize.md,
    textAlign: "center",
  },
});

export default EmptyState;
