import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import theme from "../theme";

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
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

        {/* Info card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Member since</Text>
          <Text style={styles.cardValue}>{formatDate(user.createdAt)}</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scroll: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  avatarContainer: { alignItems: "center", marginBottom: theme.spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    color: "#fff",
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
  },
  email: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  roleAdmin: { backgroundColor: theme.colors.primary + "33" },
  roleUser: { borderWidth: 1, borderColor: theme.colors.border },
  roleText: { fontSize: theme.fontSize.sm, fontWeight: "600" },
  roleTextAdmin: { color: theme.colors.primary },
  roleTextUser: { color: theme.colors.subtext },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  cardLabel: { color: theme.colors.subtext, fontSize: theme.fontSize.sm },
  cardValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    marginTop: 4,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    width: "100%",
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});

export default ProfileScreen;
