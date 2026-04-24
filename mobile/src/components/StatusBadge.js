import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

const StatusBadge = ({ status }) => {
  const color = theme.colors.status[status] || theme.colors.subtext;
  const label = STATUS_LABELS[status] || status;

  return (
    <View style={[styles.badge, { backgroundColor: color + "33" }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.lg,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
  },
});

export default StatusBadge;
