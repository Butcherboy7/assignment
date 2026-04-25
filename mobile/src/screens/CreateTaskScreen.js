import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { tasks as tasksApi, users as usersApi, getErrorMessage } from "../services/api";
import AppHeader from "../components/AppHeader";
import theme from "../theme";

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersApi.getAll();
        const users = res.data.data;
        setAllUsers(users);
        if (users.length > 0) setAssignedTo(users[0]._id);
      } catch {
        // ignore
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !assignedTo) {
      Alert.alert("Error", "Title and Assignee are required.");
      return;
    }
    setSubmitting(true);
    try {
      await tasksApi.create({
        title,
        description,
        priority,
        assignedTo,
        dueDate: dueDate || null,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      navigation.navigate("Tasks");
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <AppHeader title="New Task" subtitle="Create and assign to a team member" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          <View style={styles.formCard}>
            <Text style={styles.label}>Task Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="text-outline" size={18} color={theme.colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="E.g., Update landing page..."
                placeholderTextColor={theme.colors.subtext}
              />
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.inputContainer, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add details, links, or notes..."
              placeholderTextColor={theme.colors.subtext}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <View style={styles.row}>
              <View style={[styles.col, { marginRight: theme.spacing.sm }]}>
                <Text style={styles.label}>Assignee</Text>
                <View style={styles.pickerWrapper}>
                  {loadingUsers ? (
                    <ActivityIndicator style={{ padding: 10 }} />
                  ) : (
                    <Picker
                      selectedValue={assignedTo}
                      onValueChange={setAssignedTo}
                      style={styles.picker}
                      dropdownIconColor={theme.colors.subtext}
                    >
                      {allUsers.map((u) => (
                        <Picker.Item key={u._id} label={u.name} value={u._id} color={Platform.OS === 'ios' ? theme.colors.text : null} />
                      ))}
                    </Picker>
                  )}
                </View>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={priority}
                    onValueChange={setPriority}
                    style={styles.picker}
                    dropdownIconColor={theme.colors.subtext}
                  >
                    <Picker.Item label="Low" value="low" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                    <Picker.Item label="Medium" value="medium" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                    <Picker.Item label="High" value="high" color={Platform.OS === 'ios' ? theme.colors.text : null} />
                  </Picker>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Due Date</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={18} color={theme.colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD (Optional)"
                placeholderTextColor={theme.colors.subtext}
              />
            </View>

            <TouchableOpacity style={[styles.submitBtn, submitting && styles.btnDisabled]} onPress={handleCreate} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Create Task</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md, paddingBottom: 60 },
  formCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.sm,
  },
  row: { flexDirection: "row", zIndex: 10 },
  col: { flex: 1 },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginBottom: 8,
    marginTop: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  inputIcon: { paddingLeft: theme.spacing.md },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: theme.spacing.sm,
  },
  textArea: {
    padding: theme.spacing.sm,
    height: 120,
    alignItems: "flex-start",
  },
  pickerWrapper: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  picker: { color: theme.colors.text },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: theme.spacing.xxl,
    ...theme.shadow.md,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold },
});

export default CreateTaskScreen;
