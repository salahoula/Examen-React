import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, RefreshCw, Chrome as Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  code?: number;
}

export default function ErrorView({ 
  message, 
  onRetry, 
  showHomeButton = true,
  code
}: ErrorViewProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AlertTriangle size={48} color="#E63946" />
      {code && <Text style={styles.errorCode}>Error {code}</Text>}
      <Text style={styles.errorText}>{message}</Text>
      
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={onRetry}
          >
            <RefreshCw size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
        
        {showHomeButton && (
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/home')}
          >
            <Home size={16} color="#3274D9" />
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F5F7',
  },
  errorCode: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E63946',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 250,
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
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
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
    fontWeight: '600',
    fontSize: 16,
  },
});