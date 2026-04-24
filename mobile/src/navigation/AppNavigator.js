import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

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
  <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
    <Stack.Screen name="TaskList" component={TaskListScreen} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
  </Stack.Navigator>
);

const getTabBarOptions = () => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
  },
  tabBarActiveTintColor: theme.colors.primaryLight,
  tabBarInactiveTintColor: theme.colors.subtext,
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
  },
});

const UserTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    ...getTabBarOptions(),
    tabBarIcon: ({ color, size }) => {
      const icons = { Tasks: "list", Profile: "person" };
      return <Ionicons name={icons[route.name]} size={size} color={color} />;
    },
  })}>
    <Tab.Screen name="Tasks" component={TaskStack} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    ...getTabBarOptions(),
    tabBarIcon: ({ color, size }) => {
      const icons = { Tasks: "list", Create: "add-circle", Users: "people", Profile: "person" };
      return <Ionicons name={icons[route.name]} size={size} color={color} />;
    },
  })}>
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

  if (isLoading) return <LoadingScreen text="TaskFlow Workspace..." />;

  return (
    <NavigationContainer theme={{ colors: { background: theme.colors.background } }}>
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
