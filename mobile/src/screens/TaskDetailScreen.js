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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import { tasks as tasksApi, users as usersApi, getErrorMessage } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import LoadingScreen from "../components/LoadingScreen";
import theme from "../theme";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "—"}</Text>
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

  // User status update
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
      // Non-critical
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
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
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

  if (loading) return <LoadingScreen text="Loading task…" />;
  if (!task) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Back + Edit/Delete header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          {isAdmin && !editing && (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setEditing(true)} style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {editing ? (
          /* ── Admin Edit Mode ─────────────────────────────────────────── */
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Edit Task</Text>

            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholderTextColor={theme.colors.subtext}
            />

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.subtext}
            />

            <Text style={styles.fieldLabel}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editStatus}
                onValueChange={setEditStatus}
                style={styles.picker}
                dropdownIconColor={theme.colors.subtext}
              >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="In Progress" value="in-progress" />
                <Picker.Item label="Completed" value="completed" />
              </Picker>
            </View>

            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editPriority}
                onValueChange={setEditPriority}
                style={styles.picker}
                dropdownIconColor={theme.colors.subtext}
              >
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>

            <Text style={styles.fieldLabel}>Assign To</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editAssignedTo}
                onValueChange={setEditAssignedTo}
                style={styles.picker}
                dropdownIconColor={theme.colors.subtext}
              >
                {allUsers.map((u) => (
                  <Picker.Item key={u._id} label={u.name} value={u._id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.fieldLabel}>Due Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={editDueDate}
              onChangeText={setEditDueDate}
              placeholder="Optional"
              placeholderTextColor={theme.colors.subtext}
            />

            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.btnDisabled]}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── View Mode ───────────────────────────────────────────────── */
          <>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.badgeRow}>
              <StatusBadge status={task.status} />
              <View style={{ width: theme.spacing.sm }} />
              <PriorityBadge priority={task.priority} />
            </View>

            <View style={styles.card}>
              {task.description ? (
                <>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>{task.description}</Text>
                  <View style={styles.divider} />
                </>
              ) : null}
              <InfoRow label="Assigned to" value={task.assignedTo?.name} />
              <View style={styles.divider} />
              <InfoRow label="Created by" value={task.createdBy?.name} />
              <View style={styles.divider} />
              <InfoRow label="Created" value={formatDate(task.createdAt)} />
              {task.dueDate && (
                <>
                  <View style={styles.divider} />
                  <InfoRow label="Due date" value={formatDate(task.dueDate)} />
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* User status actions at bottom */}
      {!isAdmin && !editing && task.status !== "completed" && (
        <View style={styles.actionBar}>
          {task.status === "pending" && (
            <TouchableOpacity
              style={[styles.actionBtnOutline, updatingStatus && styles.btnDisabled]}
              onPress={() => handleStatusUpdate("in-progress")}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <ActivityIndicator color={theme.colors.status["in-progress"]} />
              ) : (
                <Text style={[styles.actionBtnOutlineText, { color: theme.colors.status["in-progress"] }]}>
                  Mark In Progress
                </Text>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionBtnFill, updatingStatus && styles.btnDisabled]}
            onPress={() => handleStatusUpdate("completed")}
            disabled={updatingStatus}
          >
            {updatingStatus ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionBtnFillText}>Mark Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md, paddingBottom: 100 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  backBtn: { padding: theme.spacing.xs },
  backText: { color: theme.colors.primary, fontSize: theme.fontSize.md },
  headerActions: { flexDirection: "row", gap: theme.spacing.sm },
  editBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  editBtnText: { color: "#fff", fontSize: theme.fontSize.sm, fontWeight: "600" },
  deleteBtn: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  deleteBtnText: { color: theme.colors.error, fontSize: theme.fontSize.sm },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  infoRow: { paddingVertical: theme.spacing.xs },
  infoLabel: { color: theme.colors.subtext, fontSize: theme.fontSize.sm, marginBottom: 2 },
  infoValue: { color: theme.colors.text, fontSize: theme.fontSize.md },
  fieldLabel: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surfaceLight,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
  },
  multiline: { height: 100, textAlignVertical: "top" },
  pickerWrapper: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  picker: { color: theme.colors.text },
  editActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  cancelBtnText: { color: theme.colors.subtext },
  btnDisabled: { opacity: 0.5 },
  actionBar: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.status["in-progress"],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  actionBtnOutlineText: { fontWeight: "600", fontSize: theme.fontSize.sm },
  actionBtnFill: {
    flex: 1,
    backgroundColor: theme.colors.status.completed,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  actionBtnFillText: { color: "#fff", fontWeight: "600", fontSize: theme.fontSize.sm },
});

export default TaskDetailScreen;
