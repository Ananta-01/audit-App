import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRole } from '../context/RoleContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import formatTimestamp from '../utils/Helper';

type Audit = { timestamp: string; rating: string; checkedItems: string[]; comment: string; image?: string };

export default function AuditHistoryScreen({ navigation }: any) {
  const { role } = useRole();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadAudits = async () => setAudits(JSON.parse((await AsyncStorage.getItem('audits')) || '[]'));

  const deleteAudit = async (idx: number) => {
    const updated = audits.filter((_, i) => i !== idx);
    await AsyncStorage.setItem('audits', JSON.stringify(updated));
    setAudits(updated);
  };

  useEffect(() => navigation.addListener('focus', loadAudits), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Audit History</Text>
      <FlatList
        data={audits}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            {!!item.image && <Image source={{ uri: item.image }} style={styles.thumb} />}
            <Text style={styles.label}>Rating: <Text style={styles.value}>{item.rating}</Text></Text>
            <Text style={styles.label}>
  Checked Items:{' '}
  <Text style={styles.value}>
    {Array.isArray(item.checkedItems) && item.checkedItems.length > 0
      ? item.checkedItems.join(', ')
      : 'None'}
  </Text>
</Text>

            <Text style={styles.label}>Comment: <Text style={styles.value}>{item.comment}</Text></Text>
            {role === 'Admin' && (
              <TouchableOpacity style={styles.deleteIcon} onPress={() => { setSelectedIndex(index); setShowConfirm(true); }}>
                <Text style={styles.deleteIconText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No audits yet.</Text>}
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
    thumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
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
