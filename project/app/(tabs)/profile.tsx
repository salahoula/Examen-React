import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, logout } from '@/services/api';
import { User } from '@/types/user';
import { LogOut, User as UserIcon, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { isAuthenticated, signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const fetchUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              signOut();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3274D9" />
      </View>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <UserIcon size={64} color="#CCCCCC" />
        <Text style={styles.title}>Not Signed In</Text>
        <Text style={styles.subtitle}>Sign in to access your profile</Text>
        <TouchableOpacity style={styles.authButton}>
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Image
          source={{ 
            uri: user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'User Name'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.booksRead || 0}</Text>
          <Text style={styles.statLabel}>Books Read</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.booksOwned || 0}</Text>
          <Text style={styles.statLabel}>Books Owned</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.reviews || 0}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <UserIcon size={20} color="#333" />
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#333" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]} 
          onPress={handleLogout}
        >
          <LogOut size={20} color="#E63946" />
          <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3274D9',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#E63946',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 32,
  },
  authButton: {
    backgroundColor: '#3274D9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  authButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});