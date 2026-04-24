import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { tasks as tasksApi, users as usersApi, getErrorMessage } from "../services/api";
import AppHeader from "../components/AppHeader";
import theme from "../theme";

const CreateTaskScreen = () => {
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
      setLoadingUsers(true);
      try {
        const res = await usersApi.getAll();
        const userList = res.data.data;
        setAllUsers(userList);
        if (userList.length > 0) setAssignedTo(userList[0]._id);
      } catch (err) {
        Alert.alert("Error", getErrorMessage(err));
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    if (allUsers.length > 0) setAssignedTo(allUsers[0]._id);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !assignedTo) {
      Alert.alert("Validation", "Title and Assign To are required.");
      return;
    }
    setSubmitting(true);
    try {
      await tasksApi.create({
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedTo,
        dueDate: dueDate.trim() || null,
      });
      Alert.alert("Success", "Task created successfully!", [
        { text: "OK", onPress: resetForm },
      ]);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = !title.trim() || !assignedTo || submitting;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Create Task" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.fieldLabel}>Task Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title…"
          placeholderTextColor={theme.colors.subtext}
        />

        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Optional description…"
          placeholderTextColor={theme.colors.subtext}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.fieldLabel}>Priority</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={priority}
            onValueChange={setPriority}
            style={styles.picker}
            dropdownIconColor={theme.colors.subtext}
          >
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="High" value="high" />
          </Picker>
        </View>

        <Text style={styles.fieldLabel}>Assign To *</Text>
        {loadingUsers ? (
          <Text style={styles.loadingText}>Loading users…</Text>
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={assignedTo}
              onValueChange={setAssignedTo}
              style={styles.picker}
              dropdownIconColor={theme.colors.subtext}
            >
              {allUsers.map((u) => (
                <Picker.Item key={u._id} label={u.name} value={u._id} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.fieldLabel}>Due Date (optional)</Text>
        <TextInput
          style={styles.input}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.colors.subtext}
        />

        <TouchableOpacity
          style={[styles.submitBtn, isDisabled && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Create Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  fieldLabel: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
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
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  picker: { color: theme.colors.text },
  loadingText: {
    color: theme.colors.subtext,
    fontSize: theme.fontSize.sm,
    padding: theme.spacing.sm,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  btnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#fff", fontSize: theme.fontSize.md, fontWeight: "bold" },
});

export default CreateTaskScreen;
