import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Book, CirclePlus as PlusCircle, Search, User } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3274D9',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#919191' : '#666666',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Books',
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}