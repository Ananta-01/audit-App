import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { launchCamera } from 'react-native-image-picker';

export default function AuditFormScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<{
    rating: string;
    comment: string;
    checks: Record<string, boolean>;
    image: string;
  }>({
    rating: '',
    comment: '',
    checks: { safety: false, cleanliness: false },
    image: '',
  });

  const nextStep = () => {
    if (step === 1 && (!form.rating || form.rating === '0'))
      return Alert.alert('Please select a rating.');
    if (step === 2 && !form.checks.safety && !form.checks.cleanliness)
      return Alert.alert('Select at least one option.');
    if (step === 3 && !form.comment.trim())
      return Alert.alert('Please enter a comment.');
    setStep(p => p + 1);
  };

  const handleSubmit = () => {
    const newAudit = {
      ...form,
      timestamp: new Date().toLocaleString(),
      checkedItems: Object.entries(form.checks)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    };
    navigation.navigate('AuditSummary', { audit: newAudit });
  };

  const captureImage = () => {
    launchCamera({ mediaType: 'photo' }, res => {
      if (res.assets?.[0]?.uri) {
        const imageUri = res.assets[0].uri;
        setForm(prev => ({
          ...prev,
          image: imageUri,
        }));
      }
    });
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.label}>Rate the Environment:</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity
                key={n}
                onPress={() => setForm(p => ({ ...p, rating: n.toString() }))}
              >
                <Text style={styles.star}>
                  {+form.rating >= n ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={captureImage} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>
              {form.image ? 'Retake Photo' : 'Capture Photo'}
            </Text>
          </TouchableOpacity>
          {!!form.image && (
            <Image source={{ uri: form.image }} style={styles.preview} />
          )}
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.label}>Check applicable items:</Text>
          {['safety', 'cleanliness'].map(k => (
            <View key={k} style={styles.checkboxRow}>
              <CheckBox
                value={form.checks[k]}
                onValueChange={v =>
                  setForm(p => ({ ...p, checks: { ...p.checks, [k]: v } }))
                }
              />
              <Text style={styles.checkboxLabel}>{k}</Text>
            </View>
          ))}
        </>
      )}
      {step === 3 && (
        <>
          <Text style={styles.label}>Comments:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Enter comments"
            value={form.comment}
            onChangeText={v => setForm(p => ({ ...p, comment: v }))}
          />
        </>
      )}
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setStep(p => p - 1)}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity style={styles.navButton} onPress={nextStep}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleSubmit}>
            <Text style={styles.navButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 36,
    marginRight: 8,
  },
  imageButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
