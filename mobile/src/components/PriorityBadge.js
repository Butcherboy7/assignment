import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

const PRIORITY_LABEL = { low: "Low", medium: "Med", high: "High" };
const PRIORITY_ICON  = { low: "▲", medium: "▲▲", high: "▲▲▲" };

const PriorityBadge = ({ priority }) => {
  const color  = theme.colors.priority[priority]   || theme.colors.subtext;
  const bgColor= theme.colors.priorityBg[priority] || theme.colors.surfaceLight;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.icon, { color }]}>{PRIORITY_ICON[priority] || "▲"}</Text>
      <Text style={[styles.label, { color }]}>
        {PRIORITY_LABEL[priority] || priority}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  icon: {
    fontSize: 7,
    letterSpacing: -1,
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default PriorityBadge;
