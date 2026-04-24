import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { users as usersApi, getErrorMessage } from "../services/api";
import AppHeader from "../components/AppHeader";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import theme from "../theme";

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const UserCard = ({ user }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
    <View
      style={[
        styles.roleBadge,
        user.role === "admin" ? styles.roleAdmin : styles.roleUser,
      ]}
    >
      <Text
        style={[
          styles.roleText,
          user.role === "admin" ? styles.roleTextAdmin : styles.roleTextUser,
        ]}
      >
        {user.role === "admin" ? "Admin" : "User"}
      </Text>
    </View>
  </View>
);

const ManageUsersScreen = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await usersApi.getAll();
        setUserList(res.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <LoadingScreen text="Loading users…" />;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Manage Users" subtitle={`${userList.length} members`} />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={userList}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <UserCard user={item} />}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No users found"
              subtitle="Users will appear here once added."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    margin: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: theme.fontSize.md },
  info: { flex: 1 },
  name: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: "600" },
  email: { color: theme.colors.subtext, fontSize: theme.fontSize.sm, marginTop: 2 },
  roleBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
  },
  roleAdmin: { backgroundColor: theme.colors.primary + "33" },
  roleUser: { borderWidth: 1, borderColor: theme.colors.border },
  roleText: { fontSize: theme.fontSize.sm, fontWeight: "600" },
  roleTextAdmin: { color: theme.colors.primary },
  roleTextUser: { color: theme.colors.subtext },
});

export default ManageUsersScreen;
