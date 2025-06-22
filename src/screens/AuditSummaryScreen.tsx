import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AuditSummaryScreen({ route, navigation }: any) {
  // Get audit data passed from previous screen
  const { audit } = route.params;

  // Function to save audit to AsyncStorage
  const saveToStorage = async () => {
    const audits = JSON.parse((await AsyncStorage.getItem('audits')) || '[]');
    audits.push(audit);
    await AsyncStorage.setItem('audits', JSON.stringify(audits));
    navigation.replace('AuditHistory');
  };

  // Convert 'checks' object into readable string of selected items
  const checkedItems = Object.entries(audit.checks)
    .filter(([_, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize
    .join(', ') || 'None';

  return (
    <View style={styles.container}>
      {/* Display summary card */}
      <View style={styles.card}>
        <Text style={styles.label}>Rating:</Text>
        <Text style={styles.value}>{audit.rating}</Text>

        <Text style={styles.label}>Checked Items:</Text>
        <Text style={styles.value}>{checkedItems}</Text>

        <Text style={styles.label}>Comments:</Text>
        <Text style={styles.value}>{audit.comment}</Text>
      </View>

      {/* Confirm and Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveToStorage}>
        <Text style={styles.saveButtonText}>Confirm and Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: '#000',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  saveButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

saveButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});
