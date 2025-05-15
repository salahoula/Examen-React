import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { deleteBook } from '../api/bookApi';

const BookDetail = ({ route, navigation }) => {
  const { book, refresh } = route.params;

  const handleDelete = async () => {
    Alert.alert(
      'Supprimer le livre',
      'Êtes-vous sûr de vouloir supprimer ce livre?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book.isbn);
              refresh();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erreur', 'La suppression a échoué');
            }
          }
        }
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Button
            title="Modifier"
            onPress={() => navigation.navigate('BookForm', { book, refresh })}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Supprimer"
            onPress={handleDelete}
            color="#ff0000"
          />
        </View>
      ),
    });
  }, [navigation, book]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ISBN:</Text>
      <Text style={styles.value}>{book.isbn}</Text>
      
      <Text style={styles.label}>Titre:</Text>
      <Text style={styles.value}>{book.title}</Text>
      
      <Text style={styles.label}>Auteur:</Text>
      <Text style={styles.value}>{book.author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  buttonSpacer: {
    width: 10,
  },
});

export default BookDetail;