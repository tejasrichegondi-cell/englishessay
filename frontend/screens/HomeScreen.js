import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

import { BACKEND_URL } from '../apiConfig';
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
  const [essayText, setEssayText] = useState('');
  const [score, setScore] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
  const { user } = route.params || {};

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, tension: 50, friction: 9, delay: 200, useNativeDriver: true }),
    ]).start();

    // Shimmer loop for loading button
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Pulse for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const animateScore = () => {
    scoreAnim.setValue(0);
    Animated.spring(scoreAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }).start();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleGradeEssay = async () => {
    if (activeTab === 'text' && (!essayText || essayText.trim().length < 20)) {
      if (Platform.OS === 'web') alert("Please enter at least 20 characters.");
      else Alert.alert("Error", "Please enter a substantive essay (at least 20 characters).");
      return;
    }
    if (activeTab === 'image' && !image) {
      if (Platform.OS === 'web') alert("Please select an image first.");
      else Alert.alert("Error", "Please upload an image first.");
      return;
    }

    setLoading(true);
    setScore(null);
    setExtractedText('');

    try {
      const formData = new FormData();

      if (activeTab === 'image' && image) {
        if (Platform.OS === 'web') {
          const res = await fetch(image.uri);
          const blob = await res.blob();
          formData.append('essay_image', blob, 'essay.jpg');
        } else {
          formData.append('essay_image', { uri: image.uri, name: 'essay.jpg', type: 'image/jpeg' });
        }
      } else {
        formData.append('final_text', essayText);
      }

      const response = await axios.post(`${BACKEND_URL}/api/predict/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.score !== undefined) {
        setScore(response.data.score);
        if (response.data.extracted_text) setExtractedText(response.data.extracted_text);
        animateScore();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Failed to reach server.";
      if (Platform.OS === 'web') alert("Error: " + msg);
      else Alert.alert("Prediction Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to logout?")) navigation.replace('Login');
    } else {
      Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => navigation.replace('Login') },
      ]);
    }
  };

  const getScoreColor = (s) => {
    if (s <= 3) return '#EF4444';
    if (s <= 5) return '#F59E0B';
    if (s <= 7) return '#3B82F6';
    return '#10B981';
  };

  const getScoreLabel = (s) => {
    if (s <= 3) return 'Needs Improvement';
    if (s <= 5) return 'Average';
    if (s <= 7) return 'Good';
    return 'Excellent!';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* === HEADER === */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>👋 Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
              </View>
            </Animated.View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBadge, { backgroundColor: 'rgba(56,189,248,0.15)', borderColor: '#38BDF8' }]}>
              <Text style={styles.statIcon}>🧠</Text>
              <Text style={styles.statText}>AI Powered</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: '#10B981' }]}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statText}>Instant Score</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: 'rgba(168,85,247,0.15)', borderColor: '#A855F7' }]}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statText}>LSTM Model</Text>
            </View>
          </View>
        </Animated.View>

        {/* === MAIN CARD === */}
        <Animated.View style={[styles.mainCard, { opacity: fadeAnim, transform: [{ translateY: cardSlide }] }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>✍️  Essay Evaluation</Text>
            <Text style={styles.cardSubtitle}>Type or upload your essay to get AI score</Text>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'text' && styles.activeTab]}
              onPress={() => setActiveTab('text')}
            >
              <Text style={[styles.tabText, activeTab === 'text' && styles.activeTabText]}>📝 Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'image' && styles.activeTab]}
              onPress={() => setActiveTab('image')}
            >
              <Text style={[styles.tabText, activeTab === 'image' && styles.activeTabText]}>📷 Image</Text>
            </TouchableOpacity>
          </View>

          {/* Text Input */}
          {activeTab === 'text' && (
            <View>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={8}
                placeholder="Start typing your essay here..."
                placeholderTextColor="#475569"
                value={essayText}
                onChangeText={setEssayText}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{essayText.length} characters</Text>
            </View>
          )}

          {/* Image Upload */}
          {activeTab === 'image' && (
            <View style={styles.imageSection}>
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.changeImageBtn} onPress={pickImage}>
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadZone} onPress={pickImage}>
                  <Text style={styles.uploadIcon}>📁</Text>
                  <Text style={styles.uploadTitle}>Upload Essay Image</Text>
                  <Text style={styles.uploadSubtitle}>Tap to select an image from your gallery</Text>
                  <View style={styles.uploadBadge}>
                    <Text style={styles.uploadBadgeText}>JPG, PNG supported</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.gradeButton, loading && styles.gradeButtonLoading]}
            onPress={handleGradeEssay}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.gradeButtonText}>  Analyzing Essay...</Text>
              </View>
            ) : (
              <Text style={styles.gradeButtonText}>⚡  GENERATE SCORE</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* === SCORE RESULT === */}
        {score !== null && (
          <Animated.View
            style={[styles.resultCard, {
              opacity: scoreAnim,
              transform: [{ scale: scoreAnim }],
              borderColor: getScoreColor(score),
            }]}
          >
            <Text style={styles.resultTitle}>🎯  AI SCORING RESULT</Text>
            <View style={[styles.scoreBubble, { backgroundColor: getScoreColor(score) }]}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreOutOf}>/10</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: getScoreColor(score) }]}>
              {getScoreLabel(score)}
            </Text>

            {/* Score Bar */}
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, {
                width: `${(score / 10) * 100}%`,
                backgroundColor: getScoreColor(score),
              }]} />
            </View>

            {extractedText ? (
              <View style={styles.extractedBox}>
                <Text style={styles.extractedTitle}>📄 Extracted Text</Text>
                <Text style={styles.extractedContent}>{extractedText}</Text>
              </View>
            ) : null}

            <Text style={styles.resultFooter}>Predicted by LSTM Neural Network</Text>
          </Animated.View>
        )}

        {/* === NAVIGATION CARDS === */}
        <Animated.View style={[styles.navSection, { opacity: fadeAnim }]}>
          <Text style={styles.navTitle}>Quick Access</Text>
          <View style={styles.navGrid}>
            <TouchableOpacity
              style={[styles.navCard, { borderLeftColor: '#38BDF8' }]}
              onPress={() => navigation.navigate('Dataset')}
              activeOpacity={0.8}
            >
              <Text style={styles.navCardIcon}>📂</Text>
              <View>
                <Text style={styles.navCardTitle}>Dataset</Text>
                <Text style={styles.navCardSub}>View training data</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navCard, { borderLeftColor: '#10B981' }]}
              onPress={() => navigation.navigate('Training')}
              activeOpacity={0.8}
            >
              <Text style={styles.navCardIcon}>📊</Text>
              <View>
                <Text style={styles.navCardTitle}>Training</Text>
                <Text style={styles.navCardSub}>Model metrics</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* === LOGOUT === */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪  Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // HEADER
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#0D1526',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(56,189,248,0.15)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  statIcon: { fontSize: 12 },
  statText: { fontSize: 11, color: '#CBD5E1', fontWeight: '600' },

  // MAIN CARD
  mainCard: {
    marginHorizontal: 16,
    backgroundColor: '#0D1934',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F1F5F9',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },

  // TABS
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A1120',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1D4ED8',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: { fontSize: 14, color: '#64748B', fontWeight: '700' },
  activeTabText: { color: '#fff' },

  // TEXT INPUT
  textInput: {
    backgroundColor: '#060B18',
    borderRadius: 14,
    padding: 16,
    color: '#F8FAFC',
    fontSize: 15,
    height: 180,
    borderWidth: 1,
    borderColor: '#1E293B',
    lineHeight: 22,
  },
  charCount: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 4,
  },

  // IMAGE UPLOAD
  imageSection: { marginBottom: 4 },
  uploadZone: {
    borderWidth: 2,
    borderColor: '#1E293B',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#060D1F',
  },
  uploadIcon: { fontSize: 40, marginBottom: 10 },
  uploadTitle: { fontSize: 16, fontWeight: '800', color: '#CBD5E1', marginBottom: 6 },
  uploadSubtitle: { fontSize: 13, color: '#475569', textAlign: 'center', marginBottom: 12 },
  uploadBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  uploadBadgeText: { fontSize: 11, color: '#94A3B8' },
  imagePreviewContainer: { alignItems: 'center' },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 10,
  },
  changeImageBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeImageText: { color: '#38BDF8', fontWeight: '700', fontSize: 13 },

  // GRADE BUTTON
  gradeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  gradeButtonLoading: { backgroundColor: '#1E3A8A', opacity: 0.8 },
  gradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },

  // RESULT CARD
  resultCard: {
    marginHorizontal: 16,
    backgroundColor: '#0D1934',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 2,
    marginBottom: 16,
  },
  scoreBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 72,
  },
  scoreOutOf: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  scoreBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  extractedBox: {
    width: '100%',
    backgroundColor: '#0A1120',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  extractedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 1,
  },
  extractedContent: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  resultFooter: {
    fontSize: 11,
    color: '#334155',
    fontStyle: 'italic',
  },

  // NAV CARDS
  navSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 12,
    letterSpacing: 1,
  },
  navGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  navCard: {
    flex: 1,
    backgroundColor: '#0D1934',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderTopColor: '#1E293B',
    borderRightColor: '#1E293B',
    borderBottomColor: '#1E293B',
  },
  navCardIcon: { fontSize: 24 },
  navCardTitle: { fontSize: 14, fontWeight: '800', color: '#F1F5F9' },
  navCardSub: { fontSize: 11, color: '#64748B', marginTop: 2 },

  // LOGOUT
  logoutButton: {
    marginHorizontal: 60,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
