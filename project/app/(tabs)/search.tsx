import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { searchBooks } from '@/services/api';
import BookCard from '@/components/BookCard';
import FormInput from '@/components/FormInput';
import { Book } from '@/types/book';
import { Search, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const insets = useSafeAreaInsets();
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const results = await searchBooks(query);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setSearched(false);
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FormInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by title, author or category"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearSearch}
            >
              <X size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={!query.trim() || loading}
        >
          <Search size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3274D9" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <BookCard book={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No books found</Text>
                <Text style={styles.emptySubText}>
                  Try searching with different keywords
                </Text>
              </View>
            ) : (
              <View style={styles.initialContainer}>
                <Search size={64} color="#CCCCCC" />
                <Text style={styles.emptySubText}>
                  Search for books by title, author or category
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    alignItems: 'flex-start',
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 38,
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: '#3274D9',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 24,
  },
  list: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 40,
  },
  initialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 80,
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
    textAlign: 'center',
    marginTop: 8,
  },
});