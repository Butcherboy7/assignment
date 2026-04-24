import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import theme from "../theme";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const TaskCard = ({ task, onPress, showAssignee = false }) => {
  const statusColor = theme.colors.status[task.status] || theme.colors.border;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.leftBorder, { backgroundColor: statusColor }]} />
      <View style={styles.content}>
        {/* Row 1: Title + Priority */}
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {task.title}
          </Text>
          <PriorityBadge priority={task.priority} />
        </View>

        {/* Row 2: Description */}
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Row 3: Status + assignee + due date */}
        <View style={[styles.row, styles.footer]}>
          <StatusBadge status={task.status} />
          <View style={styles.metaRight}>
            {showAssignee && task.assignedTo?.name ? (
              <Text style={styles.meta}>{task.assignedTo.name}</Text>
            ) : null}
            {task.dueDate ? (
              <Text style={styles.meta}>{formatDate(task.dueDate)}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: { opacity: 0.8 },
  leftBorder: { width: 3 },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    marginRight: theme.spacing.sm,
  },
  description: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
  },
  footer: { marginTop: theme.spacing.xs },
  metaRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  meta: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
  },
});

export default TaskCard;
