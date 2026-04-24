import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { setLogoutCallback } from "../services/api";
import theme from "../theme";

import LoginScreen from "../screens/LoginScreen";
import TaskListScreen from "../screens/TaskListScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import ManageUsersScreen from "../screens/ManageUsersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoadingScreen from "../components/LoadingScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TaskStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: theme.colors.background },
    }}
  >
    <Stack.Screen name="TaskList" component={TaskListScreen} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
  </Stack.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.subtext,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Tasks: "list-outline",
          Profile: "person-outline",
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Tasks" component={TaskStack} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.subtext,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Tasks: "list-outline",
          Create: "add-circle-outline",
          Users: "people-outline",
          Profile: "person-outline",
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Tasks" component={TaskStack} />
    <Tab.Screen name="Create" component={CreateTaskScreen} />
    <Tab.Screen name="Users" component={ManageUsersScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : user.role === "admin" ? (
        <AdminTabs />
      ) : (
        <UserTabs />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
