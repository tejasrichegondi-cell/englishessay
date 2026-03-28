import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

const BACKEND_URL = "https://fine-memes-live.loca.lt"; 
// Note: We'll add headers in the axios calls

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    loginid: '',
    password: '',
    mobile: '',
    locality: '',
    address: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, loginid, password, mobile, locality, address, city, state } = formData;
    if (!name || !email || !loginid || !password || !mobile || !locality || !address || !city || !state) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/register/`, formData, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });

      if (response.status === 201) {
        Alert.alert("Registration Successful", "Please wait for administrator activation before logging in.", [
          { text: "OK", onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error(error);
      let errorMsg = "Registration failed.";
      if (error.response?.data) {
        // Handle specific field errors
        const errors = error.response.data;
        if (typeof errors === 'object') {
          errorMsg = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join('\n');
        } else {
          errorMsg = JSON.stringify(errors);
        }
      }
      Alert.alert("Registration Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join AI Essay Grader</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(v) => updateField('name', v)}
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(v) => updateField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor="#999"
            value={formData.mobile}
            onChangeText={(v) => updateField('mobile', v)}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Login ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a login ID"
            placeholderTextColor="#999"
            value={formData.loginid}
            onChangeText={(v) => updateField('loginid', v)}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create password"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(v) => updateField('password', v)}
            secureTextEntry
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Locality</Text>
          <TextInput
            style={styles.input}
            placeholder="Your locality"
            placeholderTextColor="#999"
            value={formData.locality}
            onChangeText={(v) => updateField('locality', v)}
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Address</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Your full address"
            placeholderTextColor="#999"
            value={formData.address}
            onChangeText={(v) => updateField('address', v)}
            multiline
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
            <View style={{ width: '48%' }}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#999"
                value={formData.city}
                onChangeText={(v) => updateField('city', v)}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#999"
                value={formData.state}
                onChangeText={(v) => updateField('state', v)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>REGISTER</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: '#38BDF8' }}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#38BDF8',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    padding: 18,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#1E3A8A',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
