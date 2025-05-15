import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { RefreshCw, Home } from 'lucide-react-native';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export default function ErrorScreen({ 
  message = 'Something went wrong', 
  onRetry,
  showHomeButton = true 
}: ErrorScreenProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.errorCode}>500</Text>
        <Text style={styles.title}>Server Error</Text>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.actions}>
          {onRetry && (
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={onRetry}
            >
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}
          
          {showHomeButton && (
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => router.push('/home')}
            >
              <Home size={20} color="#3274D9" />
              <Text style={styles.homeButtonText}>Go to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  errorCode: {
    fontSize: 64,
    fontWeight: '700',
    color: '#E63946',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#3274D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3274D9',
    gap: 8,
  },
  homeButtonText: {
    color: '#3274D9',
    fontSize: 16,
    fontWeight: '600',
  },
});