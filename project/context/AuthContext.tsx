import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// For web platform (no SecureStore available)
const tokenStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing auth token on load
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await tokenStorage.getItem('authToken');
        const userData = await tokenStorage.getItem('userData');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserFromStorage();
  }, []);
  
  const signIn = async (token: string, userData: User) => {
    try {
      await tokenStorage.setItem('authToken', token);
      await tokenStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      await tokenStorage.removeItem('authToken');
      await tokenStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Error removing auth data:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);