import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { fetchBookById, deleteBook } from '@/services/api';
import { Book } from '@/types/book';
import ErrorView from '@/components/ErrorView';
import { CreditCard as Edit, Trash2, ArrowLeft, BookOpen, Bookmark, Calendar } from 'lucide-react-native';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);
  
  const loadBook = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchBookById(Number(id));
      setBook(data);
    } catch (err) {
      setError('Failed to load book details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    if (book) {
      router.push({
        pathname: '/book/edit/[id]',
        params: { id: book.id }
      });
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(Number(id));
              Alert.alert('Success', 'Book deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book. Please try again.');
              console.error(error);
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
        <Text style={styles.loadingText}>Loading book details...</Text>
      </View>
    );
  }
  
  if (error) {
    return <ErrorView message={error} onRetry={loadBook} />;
  }
  
  if (!book) {
    return <ErrorView message="Book not found." />;
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: book.title,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: book.coverUrl || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg' }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.author}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Bookmark size={16} color="#2A9D8F" />
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{book.category}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <BookOpen size={16} color="#3274D9" />
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{book.status || 'Available'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Calendar size={16} color="#F4A261" />
              <Text style={styles.infoLabel}>Added</Text>
              <Text style={styles.infoValue}>{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Unknown'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Edit size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
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
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    padding: 8,
  },
  header: {
    position: 'relative',
    height: 240,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  author: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 40,
  },
  editButton: {
    backgroundColor: '#3274D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#E63946',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});