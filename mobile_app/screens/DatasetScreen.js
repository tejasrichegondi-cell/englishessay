import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

const BACKEND_URL = "https://englishessay-production.up.railway.app";

export default function DatasetScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataset();
  }, []);

  const fetchDataset = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dataset/`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch dataset.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cellId}>{item.essay_id}</Text>
      <Text style={styles.cellScore}>{item.domain1_score}</Text>
      <Text style={[styles.cellText, { flex: 1 }]} numberOfLines={2}>
        {item.essay}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Dataset View</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, { width: 50 }]}>ID</Text>
            <Text style={[styles.headerText, { width: 60 }]}>Score</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Essay Preview</Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
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
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    padding: 12,
  },
  headerText: {
    color: '#CBD5E1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    padding: 12,
    alignItems: 'center',
  },
  cellId: {
    color: '#94A3B8',
    width: 50,
    fontSize: 14,
  },
  cellScore: {
    color: '#38BDF8',
    width: 60,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cellText: {
    color: '#F1F5F9',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 20,
  },
});
