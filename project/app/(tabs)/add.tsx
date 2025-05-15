import { useState } from 'react';
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
import { router } from 'expo-router';
import { addBook } from '@/services/api';
import FormInput from '@/components/FormInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddBookScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  
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
    
    setLoading(true);
    
    try {
      await addBook({
        title,
        author,
        category,
        description,
        coverUrl: coverUrl.trim() || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg',
      });
      
      Alert.alert(
        'Success',
        'Book added successfully',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate back to home screen
              router.push('/home');
            }
          }
        ]
      );
      
      // Reset form
      setTitle('');
      setAuthor('');
      setCategory('');
      setDescription('');
      setCoverUrl('');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add book. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Book</Text>
        
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
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Add Book</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
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