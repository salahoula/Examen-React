import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BookList">
        <Stack.Screen 
          name="BookList" 
          component={BookList} 
          options={{ title: 'Gestion des Livres' }} 
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetail} 
          options={{ title: 'Détails du livre' }} 
        />
        <Stack.Screen 
          name="BookForm" 
          component={BookForm} 
          options={{ title: 'Ajouter/Modifier' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}