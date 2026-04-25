import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TaskCard = ({ task, onPress, showAssignee = false, index = 0 }) => {
  const statusColor = theme.colors.status[task.status] || theme.colors.border;
  const scale = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  const isOverdue =
    task.dueDate &&
    task.status !== "completed" &&
    new Date(task.dueDate) < new Date();

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        {/* Colored left accent bar */}
        <View style={[styles.accent, { backgroundColor: statusColor }]} />

        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {task.title}
            </Text>
            <PriorityBadge priority={task.priority} />
          </View>

          {/* Description */}
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          {/* Footer */}
          <View style={styles.footer}>
            <StatusBadge status={task.status} />

            <View style={styles.metaRow}>
              {showAssignee && task.assignedTo?.name ? (
                <View style={styles.chip}>
                  <Ionicons
                    name="person-outline"
                    size={10}
                    color={theme.colors.subtext}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={styles.chipText}>{task.assignedTo.name}</Text>
                </View>
              ) : null}

              {task.dueDate ? (
                <View style={[styles.chip, isOverdue && styles.chipOverdue]}>
                  <Ionicons
                    name="calendar-outline"
                    size={10}
                    color={isOverdue ? theme.colors.error : theme.colors.subtext}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={[styles.chipText, isOverdue && styles.chipTextOverdue]}>
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              ) : null}
            </View>

            <Ionicons name="chevron-forward" size={14} color="#475569" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    ...theme.shadow.sm,
  },
  accent: {
    width: 4,
    minHeight: 60,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  description: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipOverdue: {
    backgroundColor: theme.colors.errorGlow,
  },
  chipText: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.xs,
  },
  chipTextOverdue: {
    color: theme.colors.error,
  },
});

export default TaskCard;
