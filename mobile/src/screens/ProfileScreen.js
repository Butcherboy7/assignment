import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import theme from "../theme";

const getInitials = (name = "") => name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <AppHeader title="Profile" rightIcon="log-out-outline" onRight={logout} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Avatar Card */}
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={[styles.rolePill, isAdmin ? styles.rolePillAdmin : styles.rolePillUser]}>
            {isAdmin && <Ionicons name="shield-checkmark" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />}
            <Text style={[styles.rolePillText, isAdmin ? styles.roleAdminText : styles.roleUserText]}>
              {isAdmin ? "Workspace Admin" : "Team Member"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.listCard}>
          <View style={styles.listItem}>
            <View style={styles.listIcon}><Ionicons name="time" size={18} color={theme.colors.primaryLight} /></View>
            <View style={styles.listBody}>
              <Text style={styles.listLabel}>Member Since</Text>
              <Text style={styles.listValue}>{formatDate(user.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.listItem}>
            <View style={styles.listIcon}><Ionicons name="key" size={18} color={theme.colors.primaryLight} /></View>
            <View style={styles.listBody}>
              <Text style={styles.listLabel}>Password</Text>
              <Text style={styles.listValue}>••••••••</Text>
            </View>
          </View>
        </View>

        {/* Large Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out" size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out of TaskFlow</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadow.md,
  },
  avatarText: { color: "#fff", fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.extrabold },
  name: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, marginBottom: 4 },
  email: { color: theme.colors.subtext, fontSize: theme.fontSize.md, marginBottom: theme.spacing.md },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  rolePillAdmin: { backgroundColor: theme.colors.primaryGlow },
  rolePillUser: { backgroundColor: theme.colors.surfaceLight, borderWidth: 1, borderColor: theme.colors.borderLight },
  rolePillText: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold },
  roleAdminText: { color: theme.colors.primaryLight },
  roleUserText: { color: theme.colors.subtext },

  sectionTitle: { color: theme.colors.subtext, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, textTransform: "uppercase", marginBottom: 8, marginLeft: 8 },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    overflow: "hidden",
  },
  listItem: { flexDirection: "row", alignItems: "center", padding: theme.spacing.md },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  listBody: { flex: 1 },
  listLabel: { color: theme.colors.subtext, fontSize: theme.fontSize.xs, textTransform: "uppercase", marginBottom: 2 },
  listValue: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium },
  divider: { height: 1, backgroundColor: theme.colors.border, marginLeft: 68 }, // align with body

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.errorGlow,
    borderWidth: 1,
    borderColor: theme.colors.error + "44",
    borderRadius: theme.borderRadius.full,
    paddingVertical: 16,
  },
  logoutText: { color: theme.colors.error, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold },
});

export default ProfileScreen;
