import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Animated,
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

  const searchWidthAnim = useRef(new Animated.Value(1)).current;

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

  useFocusEffect(
    useCallback(() => {
      fetchTasks(true); // silent fetch on focus to not disrupt UI unless hard refresh requested
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks(true);
  };

  const filteredTasks = allTasks.filter((task) => {
    const statusMatch =
      !FILTER_STATUS_MAP[activeFilter] ||
      task.status === FILTER_STATUS_MAP[activeFilter];
    const searchMatch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  if (loading) return <LoadingScreen text="Fetching your tasks…" />;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Tasks" subtitle={isAdmin ? "All company tasks" : "Assigned to you"} />

      {/* Top Bar: Search & Filter */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={theme.colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks…"
            placeholderTextColor={theme.colors.subtext}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.filterScrollerWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.pill, isActive && styles.pillActive]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {error ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TaskCard
            task={item}
            index={index}
            showAssignee={isAdmin}
            onPress={() => navigation.navigate("TaskDetail", { taskId: item._id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No tasks found"
            subtitle={
              search
                ? "Try a different search term."
                : activeFilter !== "All"
                ? `No ${activeFilter.toLowerCase()} tasks match.`
                : "Good job! Zero tasks right now."
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
  topBar: {
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchIcon: {
    paddingLeft: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.sm,
  },
  filterScrollerWrap: {
    height: 36,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  pill: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
  },
  pillActive: { 
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  pillText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  pillTextActive: { color: "#fff", fontWeight: theme.fontWeight.semibold },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl * 2,
  },
  errorWrap: {
    margin: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.errorGlow,
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    fontSize: theme.fontSize.sm,
  },
});

export default TaskListScreen;
