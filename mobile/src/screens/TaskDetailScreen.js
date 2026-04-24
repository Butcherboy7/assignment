import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { tasks as tasksApi, users as usersApi, getErrorMessage } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import AppHeader from "../components/AppHeader";
import LoadingScreen from "../components/LoadingScreen";
import theme from "../theme";

const formatDate = (dateStr) => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const InfoRow = ({ icon, label, value, color }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoRowLeft}>
      <Ionicons name={icon} size={18} color={color || theme.colors.subtext} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, { color: color || theme.colors.text }]} numberOfLines={1}>
      {value || "—"}
    </Text>
  </View>
);

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit state (admin)
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await tasksApi.getOne(taskId);
      const t = res.data.data;
      setTask(t);
      setEditTitle(t.title);
      setEditDescription(t.description || "");
      setEditStatus(t.status);
      setEditPriority(t.priority);
      setEditDueDate(t.dueDate ? t.dueDate.split("T")[0] : "");
      setEditAssignedTo(t.assignedTo?._id || "");
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll();
      setAllUsers(res.data.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchTask();
    if (isAdmin) fetchUsers();
  }, [taskId]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await tasksApi.update(taskId, { status: newStatus });
      await fetchTask();
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await tasksApi.update(taskId, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
        priority: editPriority,
        assignedTo: editAssignedTo,
        dueDate: editDueDate || null,
      });
      await fetchTask();
      setEditing(false);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await tasksApi.remove(taskId);
            navigation.goBack();
          } catch (err) {
            Alert.alert("Error", getErrorMessage(err));
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingScreen text="Loading details…" />;
  if (!task) return null;

  const isOverdue = task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date();

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader
        title={editing ? "Edit Task" : "Task Details"}
        showBack={true}
        onBack={() => {
          if (editing) setEditing(false);
          else navigation.goBack();
        }}
        rightIcon={isAdmin && !editing ? "trash-outline" : null}
        onRight={handleDelete}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {editing ? (
            /* --- Admin Edit View --- */
            <View style={styles.editForm}>
              <Text style={styles.sectionHeader}>Task Info</Text>

              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholderTextColor={theme.colors.subtext}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={theme.colors.subtext}
              />

              <View style={styles.row}>
                <View style={[styles.col, { marginRight: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Status</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker selectedValue={editStatus} onValueChange={setEditStatus} style={styles.picker} dropdownIconColor={theme.colors.subtext}>
                      <Picker.Item label="Pending" value="pending" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                      <Picker.Item label="In Progress" value="in-progress" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                      <Picker.Item label="Completed" value="completed" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                    </Picker>
                  </View>
                </View>

                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Priority</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker selectedValue={editPriority} onValueChange={setEditPriority} style={styles.picker} dropdownIconColor={theme.colors.subtext}>
                      <Picker.Item label="Low" value="low" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                      <Picker.Item label="Medium" value="medium" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                      <Picker.Item label="High" value="high" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                    </Picker>
                  </View>
                </View>
              </View>

              <Text style={styles.inputLabel}>Assigned To</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={editAssignedTo} onValueChange={setEditAssignedTo} style={styles.picker} dropdownIconColor={theme.colors.subtext}>
                  {allUsers.map((u) => (
                    <Picker.Item key={u._id} label={u.name} value={u._id} color={Platform.OS === 'ios' ? theme.colors.text : null} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Due Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={editDueDate}
                onChangeText={setEditDueDate}
                placeholder="Leave blank for none"
                placeholderTextColor={theme.colors.subtext}
              />

              <TouchableOpacity style={[styles.saveBtn, saving && styles.btnDisabled]} onPress={handleSaveEdit} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            /* --- View Mode --- */
            <View style={styles.content}>
              <View style={styles.titleCard}>
                <View style={styles.badgeRow}>
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </View>
                <Text style={styles.title}>{task.title}</Text>
                {task.description ? (
                  <Text style={styles.description}>{task.description}</Text>
                ) : null}
              </View>

              <Text style={styles.sectionHeader}>Details</Text>
              <View style={styles.infoCard}>
                <InfoRow icon="person-outline" label="Assigned To" value={task.assignedTo?.name} />
                <View style={styles.divider} />
                <InfoRow icon="calendar-outline" label="Due Date" value={formatDate(task.dueDate)} color={isOverdue ? theme.colors.error : null} />
                <View style={styles.divider} />
                <InfoRow icon="shield-checkmark-outline" label="Created By" value={task.createdBy?.name} />
              </View>

              {isAdmin && (
                <TouchableOpacity onPress={() => setEditing(true)} style={styles.editFloatBtn}>
                  <Ionicons name="pencil" size={20} color="#fff" />
                  <Text style={styles.editFloatText}>Edit Task</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Action Bar for Users */}
      {!isAdmin && !editing && task.status !== "completed" && (
        <View style={styles.actionBar}>
          {task.status === "pending" && (
            <TouchableOpacity style={styles.actionBtnOutline} onPress={() => handleStatusUpdate("in-progress")} disabled={updatingStatus}>
              {updatingStatus ? <ActivityIndicator color={theme.colors.status["in-progress"]} /> : <Text style={styles.actionBtnOutlineText}>Start Progress</Text>}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionBtnFill} onPress={() => handleStatusUpdate("completed")} disabled={updatingStatus}>
            {updatingStatus ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnFillText}>Mark Completed</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md, paddingBottom: 120 },
  
  // View Details Mode
  content: { gap: theme.spacing.md },
  titleCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeRow: { flexDirection: "row", gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: -0.5,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    lineHeight: 24,
  },
  sectionHeader: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    marginLeft: 4,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  infoRowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { color: theme.colors.subtext, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium },
  infoValue: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium, maxWidth: '50%' },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 4 },
  
  editFloatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.xl,
    gap: 8,
    ...theme.shadow.lg,
  },
  editFloatText: { color: "#fff", fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold },

  // Edit Mode
  editForm: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: { flexDirection: "row" },
  col: { flex: 1 },
  inputLabel: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginBottom: 6,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surfaceLight,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: theme.fontSize.md,
  },
  textArea: { height: 100, paddingTop: 14 },
  pickerWrapper: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  picker: { color: theme.colors.text },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: theme.spacing.xl,
    ...theme.shadow.md,
  },
  saveBtnText: { color: "#fff", fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold },
  btnDisabled: { opacity: 0.6 },

  // User Actions Bottom Bar
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceRaised,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadow.lg,
  },
  actionBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.status["in-progress"],
    backgroundColor: theme.colors.statusBg["in-progress"],
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionBtnOutlineText: { color: theme.colors.status["in-progress"], fontWeight: theme.fontWeight.bold },
  actionBtnFill: {
    flex: 1,
    backgroundColor: theme.colors.status.completed,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionBtnFillText: { color: "#fff", fontWeight: theme.fontWeight.bold },
});

export default TaskDetailScreen;
