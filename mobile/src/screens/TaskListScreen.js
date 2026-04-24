import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { tasks as tasksApi, getErrorMessage } from "../services/api";
import TaskCard from "../components/TaskCard";
import AppHeader from "../components/AppHeader";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import theme from "../theme";

const FILTERS = ["All", "Pending", "In Progress", "Completed"];
const FILTER_STATUS_MAP = {
  All: null,
  Pending: "pending",
  "In Progress": "in-progress",
  Completed: "completed",
};

const TaskListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await tasksApi.getAll();
      setAllTasks(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks(true);
  };

  // Filter + search
  const filteredTasks = allTasks.filter((task) => {
    const statusMatch =
      !FILTER_STATUS_MAP[activeFilter] ||
      task.status === FILTER_STATUS_MAP[activeFilter];
    const searchMatch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  if (loading) return <LoadingScreen text="Loading tasks…" />;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title={isAdmin ? "All Tasks" : "My Tasks"} />

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={theme.colors.subtext} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks…"
          placeholderTextColor={theme.colors.subtext}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.pill, activeFilter === f && styles.pillActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillText,
                activeFilter === f && styles.pillTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            showAssignee={isAdmin}
            onPress={() => navigation.navigate("TaskDetail", { taskId: item._id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-outline"
            title="No tasks found"
            subtitle={
              search
                ? "Try a different search term."
                : activeFilter !== "All"
                ? `No ${activeFilter.toLowerCase()} tasks.`
                : "Tasks assigned to you will appear here."
            }
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  searchIcon: { marginRight: theme.spacing.xs },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    paddingVertical: theme.spacing.sm,
  },
  filterBar: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  pill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  pillActive: { backgroundColor: theme.colors.primary },
  pillText: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
  },
  pillTextActive: { color: "#fff" },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    margin: theme.spacing.md,
    fontSize: theme.fontSize.sm,
  },
});

export default TaskListScreen;
