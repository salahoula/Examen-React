import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { fetchBookById, updateBook } from '@/services/api';
import { Book } from '@/types/book';
import FormInput from '@/components/FormInput';
import ErrorView from '@/components/ErrorView';
import { ArrowLeft } from 'lucide-react-native';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
      setTitle(data.title);
      setAuthor(data.author);
      setCategory(data.category);
      setDescription(data.description);
      setCoverUrl(data.coverUrl || '');
    } catch (err) {
      setError('Failed to load book details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setSaving(true);
    
    try {
      await updateBook(Number(id), {
        title,
        author,
        category,
        description,
        coverUrl: coverUrl.trim() || book?.coverUrl || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg',
      });
      
      Alert.alert(
        'Success',
        'Book updated successfully',
        [
          { 
            text: 'OK', 
            onPress: () => {
              router.push({
                pathname: '/book/[id]',
                params: { id }
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update book. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
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
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Book',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
            error={errors.title}
          />
          
          <FormInput
            label="Author"
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
            error={errors.author}
          />
          
          <FormInput
            label="Category"
            value={category}
            onChangeText={setCategory}
            placeholder="Enter book category"
            error={errors.category}
          />
          
          <FormInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description"
            multiline
            numberOfLines={4}
            error={errors.description}
          />
          
          <FormInput
            label="Cover URL (optional)"
            value={coverUrl}
            onChangeText={setCoverUrl}
            placeholder="Enter cover image URL"
            error={errors.coverUrl}
          />
          
          <TouchableOpacity 
            style={[styles.submitButton, saving && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Update Book</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#3274D9',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});