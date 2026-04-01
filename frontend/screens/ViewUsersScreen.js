import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

import { BACKEND_URL } from '../apiConfig';

export default function ViewUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/users/`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch user list.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (uid) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/activate/?uid=${uid}`);
      if (response.data.message) {
        Alert.alert("Success", "User activated successfully.");
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Activation failed.");
    }
  };

  const renderUserCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userIconContainer}>
          <Text style={styles.userIcon}>👤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userLoginId}>@{item.loginid}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'activated' ? styles.statusActive : styles.statusPending]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow label="📧 Email" value={item.email} />
        <DetailRow label="📱 Mobile" value={item.mobile} />
        <DetailRow label="📍 City" value={`${item.city}, ${item.state}`} />
        <DetailRow label="🏠 Address" value={item.address} />
      </View>

      {item.status !== 'activated' && (
        <TouchableOpacity 
          style={styles.activateButton} 
          onPress={() => handleActivate(item.id)}
        >
          <Text style={styles.activateButtonText}>ACTIVATE ACCOUNT</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Registered Users</Text>
        <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F43F5E" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No users registered yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
  },
  backButton: { padding: 10 },
  backButtonText: { color: '#F8FAFC', fontSize: 24, fontWeight: 'bold' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#F8FAFC' },
  refreshButton: { padding: 10 },
  refreshIcon: { fontSize: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: '#94A3B8', fontSize: 16 },
  listContent: { padding: 15 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userIcon: { fontSize: 24 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' },
  userLoginId: { fontSize: 14, color: '#94A3B8' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: { backgroundColor: '#064E3B', color: '#10B981' },
  statusPending: { backgroundColor: '#7C2D12', color: '#F59E0B' },
  statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: { color: '#94A3B8', fontSize: 13 },
  detailValue: { color: '#F8FAFC', fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right', marginLeft: 10 },
  activateButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
