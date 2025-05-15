import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { createBook, updateBook } from '../api/bookApi';

const BookForm = ({ route, navigation }) => {
  const { book, refresh } = route.params || {};
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');

  const handleSubmit = async () => {
    if (!isbn || !title || !author) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    try {
      if (book) {
        await updateBook(book.isbn, { isbn, title, author });
      } else {
        await createBook({ isbn, title, author });
      }
      refresh();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: book ? 'Modifier le livre' : 'Ajouter un livre',
    });
  }, [navigation, book]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ISBN"
        value={isbn}
        onChangeText={setIsbn}
        editable={!book}
      />
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Auteur"
        value={author}
        onChangeText={setAuthor}
      />
      <Button
        title={book ? "Mettre à jour" : "Ajouter"}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default BookForm;