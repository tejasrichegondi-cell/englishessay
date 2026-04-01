import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AdminHomeScreen({ navigation }) {
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) navigation.replace('Login');
    } else {
      Alert.alert("Logout", "Logout from admin panel?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace('Login') }
      ]);
    }
  };

  const AdminButton = ({ title, subtitle, icon, onPress, color }) => (
    <TouchableOpacity 
      style={[styles.menuButton, { borderLeftColor: color }]} 
      onPress={onPress}
    >
      <View style={styles.menuIconContainer}>
        <Text style={styles.menuIcon}>{icon}</Text>
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System Controller</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <AdminButton 
          title="View Registered Users"
          subtitle="Manage and activate accounts"
          icon="👥"
          color="#38BDF8"
          onPress={() => navigation.navigate('AdminUsers')}
        />

        <AdminButton 
          title="Model Performance"
          subtitle="Check training metrics"
          icon="📊"
          color="#10B981"
          onPress={() => navigation.navigate('Training')}
        />

        <AdminButton 
          title="Dataset Management"
          subtitle="View repository data"
          icon="📂"
          color="#F59E0B"
          onPress={() => navigation.navigate('Dataset')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT SESSION</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: '#475569',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#E11D48',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
