import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

/**
 * AppHeader
 * Props:
 *   title     - main heading
 *   subtitle  - optional sub-line
 *   showBack  - show a back chevron button
 *   onBack    - callback for back press
 *   rightIcon - Ionicons icon name for right action
 *   onRight   - callback for right action
 */
const AppHeader = ({ title, subtitle, showBack, onBack, rightIcon, onRight }) => (
  <View style={styles.container}>
    <View style={styles.row}>
      {showBack ? (
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.logoMark}>
          <Text style={styles.logoChar}>T</Text>
        </View>
      )}

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      {rightIcon ? (
        <TouchableOpacity onPress={onRight} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      ) : <View style={styles.iconBtn} />}
    </View>

    {/* Gradient-like divider */}
    <View style={styles.divider} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingTop: Platform.OS === "android" ? theme.spacing.sm : 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoChar: {
    color: "#fff",
    fontSize: theme.fontSize.lg,
    fontWeight: "800",
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 0,
  },
});

export default AppHeader;
