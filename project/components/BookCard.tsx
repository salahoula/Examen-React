import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Bookmark, BookOpen } from 'lucide-react-native';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id }
    });
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={{ uri: book.coverUrl || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg' }}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>by {book.author}</Text>
        
        <View style={styles.categoryContainer}>
          <Bookmark size={14} color="#2A9D8F" />
          <Text style={styles.category}>{book.category}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {book.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.readStatus}>
            <BookOpen size={14} color="#3274D9" />
            <Text style={styles.readStatusText}>
              {book.status || 'Available'}
            </Text>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cover: {
    width: 100,
    height: 150,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#2A9D8F',
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readStatusText: {
    fontSize: 12,
    color: '#3274D9',
    marginLeft: 4,
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F4F9',
    borderRadius: 6,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#3274D9',
    fontWeight: '500',
  },
});