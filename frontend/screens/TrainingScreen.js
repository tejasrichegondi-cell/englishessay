import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

import { BACKEND_URL } from '../apiConfig';

export default function TrainingScreen({ navigation }) {
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/training/`);
        setTrainingData(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load training info.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainingData();
  }, []);

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Model Training</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⚙️</Text>
            </View>
            <Text style={styles.cardTitle}>Model Architecture</Text>
            
            <InfoRow label="Architecture" value={trainingData?.model_type} />
            <InfoRow label="Optimizer" value={trainingData?.optimizer} />
            <InfoRow label="Loss Function" value={trainingData?.loss_function} />
            <InfoRow label="Epochs" value={trainingData?.epochs} />
            <InfoRow label="Accuracy" value={trainingData?.accuracy} />
            <InfoRow label="Validation Split" value={trainingData?.validation_split * 100 + "%"} />
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Model Summary</Text>
            <Text style={styles.noteText}>
              The model uses Word2Vec embeddings for semantic feature extraction and a Bidirectional LSTM 
              architecture to capture seasonal dependencies and context within the essay text. 
              The final output is passed through a dense layer with ReLU activation to predict the regression score (0-10).
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 20,
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noteCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#0F172A',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  noteText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  }
});
