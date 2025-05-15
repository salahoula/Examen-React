import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  Image 
} from 'react-native';
import { fetchBooks } from '@/services/api';
import BookCard from '@/components/BookCard';
import ErrorScreen from '@/components/ErrorScreen';
import { Book } from '@/types/book';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const insets = useSafeAreaInsets();
  
  const loadBooks = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    
    setError(null);
    
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadBooks();
  }, []);
  
  const handleRefresh = () => {
    loadBooks(true);
  };
  
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3274D9" />
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }
  
  if (error) {
    return <ErrorScreen message={error.message} onRetry={() => loadBooks()} />;
  }
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={books}
        renderItem={({ item }) => <BookCard book={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#3274D9']} 
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' }} 
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubText}>Add some books to your collection</Text>
          </View>
        }
      />
    </View>
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
  list: {
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
  },
});