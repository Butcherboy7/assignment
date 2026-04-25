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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { tasks as tasksApi, users as usersApi, getErrorMessage } from "../services/api";
import AppHeader from "../components/AppHeader";
import theme from "../theme";

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(null);
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

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
              <TouchableOpacity
                onPress={() => { Keyboard.dismiss(); setShowDatePicker(true); }}
                style={[
                  styles.inputContainer,
                  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: Platform.OS === 'ios' ? 14 : 10, paddingHorizontal: theme.spacing.sm }
                ]}
                activeOpacity={0.7}
              >
                <Text style={{ color: dueDate ? theme.colors.text : theme.colors.subtext, fontSize: theme.fontSize.md, paddingLeft: theme.spacing.sm }}>
                  {dueDate
                    ? dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : "Select due date (optional)"
                  }
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingRight: theme.spacing.sm }}>
                  {dueDate && (
                    <TouchableOpacity
                      onPress={(e) => { e.stopPropagation(); setDueDate(null); }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close-circle" size={16} color={theme.colors.subtext} />
                    </TouchableOpacity>
                  )}
                  <Ionicons name="calendar-outline" size={18} color={theme.colors.subtext} />
                </View>
              </TouchableOpacity>

              {showDatePicker && Platform.OS === "ios" && (
                <View style={{ backgroundColor: theme.colors.surfaceLight, borderRadius: 12, marginTop: 8, overflow: "hidden" }}>
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 8 }}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={{ color: theme.colors.primary, fontSize: 15, fontWeight: "600" }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => { if (selectedDate) setDueDate(selectedDate); }}
                    minimumDate={new Date()}
                    themeVariant="dark"
                    textColor="#F1F5F9"
                    style={{ height: 180 }}
                  />
                </View>
              )}

              {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (event.type === "set" && selectedDate) setDueDate(selectedDate);
                  }}
                  minimumDate={new Date()}
                />
              )}

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
      </TouchableWithoutFeedback>
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
