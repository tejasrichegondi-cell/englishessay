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

export default function HomeScreen({ navigation, route }) {
  const [essayText, setEssayText] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = route.params || {};

  const handleGradeEssay = async () => {
    if (!essayText || essayText.trim().length < 20) {
      Alert.alert("Error", "Please enter a substantive essay (at least 20 characters).");
      return;
    }

    setLoading(true);
    setScore(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/predict/`, {
        final_text: essayText
      }, {
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data && response.data.score !== undefined) {
        setScore(response.data.score);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to reach backend server.";
      Alert.alert("Prediction Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace('Login') }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Essay Grader</Text>
          <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Paste your essay below:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={10}
            placeholder="Type or paste your essay here..."
            placeholderTextColor="#999"
            value={essayText}
            onChangeText={setEssayText}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleGradeEssay}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>GRADE ESSAY</Text>
            )}
          </TouchableOpacity>
        </View>

        {score !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>AI SCORING RESULT</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{score}</Text>
              <Text style={styles.scoreMax}>/ 10</Text>
            </View>
            <Text style={styles.resultHint}>Predicted Score from LSTM Model</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
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
    paddingTop: 40,
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 15,
    color: '#F8FAFC',
    fontSize: 16,
    height: 200,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#1E3A8A',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#166534',
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DCFCE7',
    letterSpacing: 1.5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
  },
  scoreMax: {
    fontSize: 24,
    fontWeight: '600',
    color: '#DCFCE7',
    marginLeft: 5,
  },
  resultHint: {
    fontSize: 12,
    color: '#BBF7D0',
    fontStyle: 'italic',
  },
  logoutButton: {
    marginTop: 40,
    padding: 10,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
