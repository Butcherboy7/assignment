import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

const LABELS = { low: "Low", medium: "Medium", high: "High" };

const PriorityBadge = ({ priority }) => {
  const color = theme.colors.priority[priority] || theme.colors.subtext;
  const label = LABELS[priority] || priority;

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
  },
});

export default PriorityBadge;
