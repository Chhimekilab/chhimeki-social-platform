import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import NeighborhoodScreen from './src/screens/NeighborhoodScreen';
import ProfessionalScreen from './src/screens/ProfessionalScreen';
import CommunitiesScreen from './src/screens/CommunitiesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';

// Import navigation types
import { RootTabParamList, RootStackParamList } from './src/types/navigation';

// Import theme
import { useTheme } from '@chhimeki/design-system';
import { theme } from './src/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Neighborhood" 
        component={NeighborhoodScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MapPinIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Professional" 
        component={ProfessionalScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BriefcaseIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Communities" 
        component={CommunitiesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UsersIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BellIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const { effectiveTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!isAuthenticated ? (
                <Stack.Screen name="Auth" component={AuthScreen} />
              ) : (
                <Stack.Screen name="Main" component={TabNavigator} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Simple icon components (you can replace with react-native-vector-icons or expo/vector-icons)
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home" size={size} color={color} />
);

const MapPinIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="location" size={size} color={color} />
);

const BriefcaseIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="briefcase" size={size} color={color} />
);

const UsersIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="people" size={size} color={color} />
);

const BellIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="notifications" size={size} color={color} />
);

const UserIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="person" size={size} color={color} />
);

// Import Ionicons
import { Ionicons } from '@expo/vector-icons';