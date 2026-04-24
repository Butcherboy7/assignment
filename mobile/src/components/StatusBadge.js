import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import theme from "../theme";

// Normalize status label for display
const STATUS_LABEL = {
  pending:      "Pending",
  "in-progress": "In Progress",
  completed:    "Completed",
};

const STATUS_DOT = {
  pending:      "●",
  "in-progress": "●",
  completed:    "●",
};

const StatusBadge = ({ status }) => {
  const color  = theme.colors.status[status]  || theme.colors.subtext;
  const bgColor= theme.colors.statusBg[status]|| theme.colors.surfaceLight;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.dot, { color }]}>{STATUS_DOT[status] || "●"}</Text>
      <Text style={[styles.label, { color }]}>
        {STATUS_LABEL[status] || status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  dot: {
    fontSize: 7,
    lineHeight: Platform.OS === "ios" ? 13 : 14,
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

export default StatusBadge;
