import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import DashboardScreen from '../screens/main/DashboardScreen';
import ToolsScreen from '../screens/tools/ToolsScreen';
import ToolDetailScreen from '../screens/tools/ToolDetailScreen';
import ToolResultScreen from '../screens/tools/ToolResultScreen';
import MemeGeneratorScreen from '../screens/tools/MemeGeneratorScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import SubscriptionScreen from '../screens/profile/SubscriptionScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import TermsScreen from '../screens/profile/TermsScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import ContactScreen from '../screens/profile/ContactScreen';
import HistoryScreen from '../screens/main/HistoryScreen';

import { useAuthStore } from '../store/authStore';
import { Colors } from '../constants/theme';

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  ToolDetail: { toolSlug: string; prefillInputs?: Record<string, any> };
  ToolResult: { toolSlug: string; result: any; inputs?: Record<string, any> };
  MemeGenerator: undefined;
  Settings: undefined;
  Subscription: undefined;
  Notifications: undefined;
  Terms: undefined;
  Privacy: undefined;
  Contact: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tools: undefined;
  Chat: undefined;
  History: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator
    id="AuthStack"
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background },
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Tab Navigator
const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      id="MainTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0A', // Deep black for tab bar
          borderTopColor: 'rgba(255,255,255,0.05)',
          borderTopWidth: 1,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          height: 60 + bottomPadding,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#9D4EDD', // The purple from the image
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Tools':
              iconName = 'grid'; // Or list icon depending on what we have
              break;
            case 'Chat':
              iconName = 'message-circle';
              break;
            case 'History':
              iconName = 'clock';
              break;
            case 'Profile':
              iconName = 'user';
              break;
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={iconName} size={24} color={focused ? '#9D4EDD' : color} />
            </View>
          );
        },
      })}
    >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="Tools" component={ToolsScreen} options={{ title: 'Tools' }} />
    <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'AI Chat' }} />
    <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
  );
};

// Loading Screen
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.accent} />
  </View>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="ToolDetail"
              component={ToolDetailScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="ToolResult" component={ToolResultScreen} />
            <Stack.Screen
              name="MemeGenerator"
              component={MemeGeneratorScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  activeTabIcon: {
    backgroundColor: Colors.accent + '20',
    borderRadius: 12,
    padding: 8,
  },
});

export default AppNavigator;
