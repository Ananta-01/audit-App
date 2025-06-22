import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function AuditFormScreen({ navigation }: any) {
  // Multi-step form state
  const [step, setStep] = useState(1);

  // Audit form state
  const [form, setForm] = useState({
    rating: '',
    checks: { safety: false, cleanliness: false },
    comment: '',
  });

  // Handle step validation and go to next
  const nextStep = () => {
    if (step === 1 && (!form.rating || form.rating === '0')) {
      Alert.alert('Please select a rating before continuing.');
      return;
    }

    if (
      step === 2 &&
      !form.checks.safety &&
      !form.checks.cleanliness
    ) {
      Alert.alert('Please select at least one checkbox.');
      return;
    }

    if (step === 3 && !form.comment.trim()) {
      Alert.alert('Please enter a comment before continuing.');
      return;
    }

    setStep((prev) => prev + 1);
  };

  // Move to previous step
  const prevStep = () => setStep((prev) => prev - 1);

  // Final submission handler
  const handleSubmit = () => {
    const selectedChecks = Object.entries(form.checks)
      .filter(([_, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize labels

    const newAudit = {
      ...form,
      checkedItems: selectedChecks,
      timestamp: new Date().toLocaleString(), // human-readable format
    };

    navigation.navigate('AuditSummary', { audit: newAudit });
  };

  // Handle rating via star tap
  const handleStarPress = (value: number) => {
    setForm((prev) => ({ ...prev, rating: value.toString() }));
  };

  return (
    <View style={styles.container}>
      {/* Step 1: Rating Stars */}
      {step === 1 && (
        <>
          <Text style={styles.label}>Rate the Environment:</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity key={num} onPress={() => handleStarPress(num)}>
                <Text style={styles.star}>
                  {parseInt(form.rating) >= num ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Step 2: Checkbox Section */}
      {step === 2 && (
        <>
          <Text style={styles.label}>Check applicable items:</Text>
          {Object.keys(form.checks).map((key) => (
            <View style={styles.checkboxRow} key={key}>
              <CheckBox
                value={form.checks[key as keyof typeof form.checks]}
                onValueChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    checks: { ...prev.checks, [key]: val },
                  }))
                }
              />
              <Text style={styles.checkboxLabel}>{key}</Text>
            </View>
          ))}
        </>
      )}

      {/* Step 3: Comments Section */}
      {step === 3 && (
        <>
          <Text style={styles.label}>Comments:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Write your comments here..."
            value={form.comment}
            onChangeText={(val) => setForm({ ...form, comment: val })}
          />
        </>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity onPress={prevStep} style={styles.navButton}>
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity onPress={nextStep} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.navButton}>
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
    marginRight: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
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
