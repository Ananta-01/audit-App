import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRole } from '../context/RoleContext';

const roles = ['Admin', 'Auditor', 'Viewer'] as const;
type RoleType = typeof roles[number];

export default function LoginScreen({ navigation }: any) {
  const { setRole } = useRole();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('Auditor');
  const [error, setError] = useState('');

  const onConfirm = () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be empty');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setError('');
    setRole(selectedRole);
    navigation.replace('AuditHistory');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Select your role</Text>
      <View style={styles.radioContainer}>
        {roles.map((role) => (
          <TouchableOpacity key={role} style={styles.radioItem} onPress={() => setSelectedRole(role)}>
            <View style={styles.outerCircle}>
              {selectedRole === role && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.radioText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={[styles.button, (!username || !password) && { opacity: 0.5 }]} onPress={onConfirm} disabled={!username || !password}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: '600',
    },
    radioContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20,
        width: '100%',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    outerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    radioText: {
        fontSize: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'left',
        width: '100%',
    },

});
