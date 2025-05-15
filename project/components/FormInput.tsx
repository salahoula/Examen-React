import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function FormInput({ 
  label, 
  error, 
  value, 
  onChangeText, 
  placeholder,
  multiline,
  numberOfLines,
  ...rest 
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { height: numberOfLines ? numberOfLines * 24 : 100, textAlignVertical: 'top' },
          isFocused && styles.focusedInput,
          error && styles.errorInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  focusedInput: {
    borderColor: '#3274D9',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#E63946',
  },
  errorText: {
    color: '#E63946',
    fontSize: 12,
    marginTop: 4,
  },
});