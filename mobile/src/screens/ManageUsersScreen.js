import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { users as usersApi, getErrorMessage } from "../services/api";
import AppHeader from "../components/AppHeader";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import theme from "../theme";

const ManageUsersScreen = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setError("");
    try {
      const res = await usersApi.getAll();
      setUsersList(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  if (loading) return <LoadingScreen text="Loading team members…" />;

  const renderItem = ({ item }) => {
    const isAd = item.role === "admin";
    const initials = item.name.substring(0, 2).toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <View style={[styles.badge, isAd ? styles.badgeAdmin : styles.badgeUser]}>
          {isAd && <Ionicons name="shield" size={10} color={theme.colors.primary} style={{marginRight: 4}}/>}
          <Text style={[styles.badgeText, isAd ? styles.badgeTextAdmin : styles.badgeTextUser]}>
            {isAd ? "Admin" : "User"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Team Members" subtitle={`${usersList.length} total members`} />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={usersList}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        ListEmptyComponent={<EmptyState icon="people" title="No users found" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  info: { flex: 1 },
  name: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold },
  email: { color: theme.colors.subtext, fontSize: theme.fontSize.sm, marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeAdmin: { backgroundColor: theme.colors.primaryGlow },
  badgeUser: { backgroundColor: theme.colors.surfaceLight },
  badgeText: { fontSize: 11, fontWeight: theme.fontWeight.bold, textTransform: "uppercase" },
  badgeTextAdmin: { color: theme.colors.primaryLight },
  badgeTextUser: { color: theme.colors.subtext },
  errorText: { color: theme.colors.error, textAlign: "center", margin: theme.spacing.md },
});

export default ManageUsersScreen;
