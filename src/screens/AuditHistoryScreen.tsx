import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRole } from '../context/RoleContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import formatTimestamp from '../utils/Helper';

// Type for individual audit item
type Audit = {
  timestamp: string;
  rating: string;
  checkedItems: string[];
  comment: string;
};

export default function AuditHistoryScreen({ navigation }: any) {
  const [audits, setAudits] = useState<Audit[]>([]);
  const { role } = useRole();

  // State for delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Load audit data from AsyncStorage
  const loadAudits = async () => {
    const saved = await AsyncStorage.getItem('audits');
    setAudits(JSON.parse(saved || '[]'));
  };

  // Delete a single audit and update storage
  const deleteAudit = async (index: number) => {
    const updated = audits.filter((_, i) => i !== index);
    await AsyncStorage.setItem('audits', JSON.stringify(updated));
    setAudits(updated);
  };

  // Load audits every time screen gains focus
  useEffect(() => {
    const focus = navigation.addListener('focus', loadAudits);
    return focus;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Title */}
      <Text style={styles.title}>Audit History</Text>

      {/* Welcome Message */}
      <Text style={{ marginLeft: 10, fontSize: 16, marginBottom: 10 }}>
        {`Hi ${role}, Welcome back`}
      </Text>

      {/* Audit List */}
      <FlatList<Audit>
        data={audits}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>

            <Text style={styles.label}>Rating:</Text>
            <Text style={styles.value}>{item.rating}</Text>

            <Text style={styles.label}>Audit:</Text>
            <Text style={styles.value}>{item.checkedItems?.join(', ') || 'None'}</Text>

            <Text style={styles.label}>Comment:</Text>
            <Text style={styles.value}>{item.comment}</Text>

            {/* Admin-only delete icon */}
            {role === 'Admin' && (
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => {
                  setSelectedIndex(index);
                  setShowConfirm(true);
                }}
              >
                <Text style={styles.deleteIconText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No audits found.</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        {/* Only visible for Auditor */}
        {role === 'Auditor' && (
          <TouchableOpacity
            style={[styles.floatingButton, styles.auditButton]}
            onPress={() => navigation.navigate('AuditForm')}
          >
            <Text style={styles.floatingButtonText}>+ New Audit</Text>
          </TouchableOpacity>
        )}

        {/* Policy button always visible */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.policyButton]}
          onPress={() => navigation.navigate('PolicyViewer')}
        >
          <Text style={styles.floatingButtonText}>Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this audit?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => {
                  setShowConfirm(false);
                  setSelectedIndex(null);
                }}
              >
                <Text>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#d9534f' }]}
                onPress={() => {
                  if (selectedIndex !== null) deleteAudit(selectedIndex);
                  setShowConfirm(false);
                  setSelectedIndex(null);
                }}
              >
                <Text style={{ color: 'white' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 6,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  floatingButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 6,
    elevation: 4,
  },
  policyButton: {
    backgroundColor: '#007AFF',
  },
  auditButton: {
    backgroundColor: '#4CAF50',
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  deleteIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 18,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },


});
