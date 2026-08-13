import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, Alert, Platform, useWindowDimensions,
  KeyboardAvoidingView, ScrollView, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

const API_URL = Platform.OS === 'web'
  ? 'http://127.0.0.1:8000/api'
  : 'http://10.84.239.170:8000/api'; // IP Hotspot HP

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;

  const [fontsLoaded] = useFonts({
    Nunito_800ExtraBold,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!fontsLoaded) {
    return null; // Tunggu font selesai diload
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Perhatian', 'Email dan password tidak boleh kosong.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.access_token;
      await AsyncStorage.setItem('userToken', token);
      router.replace('/home');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Tidak dapat terhubung ke server.';
      Alert.alert('Login Gagal', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const cardMaxWidth = isTablet ? 480 : width;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ===== HEADER BIRU GRADIENT ===== */}
          <LinearGradient
            colors={['#0F6FAF', '#26B7D8']}
            style={[styles.header, { minHeight: isTablet ? height * 0.35 : height * 0.38 }]}
          >
            {/* Dekorasi Aksen Sudut Emas */}
            <LinearGradient
              colors={['#F7D117', '#F5C400']}
              style={styles.cornerAccent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Dekorasi Lingkaran Putih Transparan */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.headerContent}>
              <View style={styles.plnBadge}>
                <Image 
                  source={require('../../assets/images/tabIcons/logo.pln.png')}
                  style={{ width: '100%', height: '100%', borderRadius: 16 }}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.helloText}>BAPAT</Text>
              <Text style={styles.subText}>
                Berita Acara Pembongkaran{'\n'}Aktiva Tetap UPT Madiun
              </Text>
            </View>

            {/* Dekorasi ikon petir raksasa (watermark background) */}
            <View style={styles.boltDecor}>
              <MaterialIcons name="bolt" size={260} color="rgba(21, 101, 192, 0.15)" />
            </View>
          </LinearGradient>

          {/* ===== KARTU FORM LOGIN ===== */}
          <View style={[styles.card, { maxWidth: cardMaxWidth, alignSelf: 'center', width: '100%' }]}>
            <Text style={styles.loginTitle}>Login</Text>

            {/* Input Email */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Input Password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Lupa Password */}
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>

            {/* Tombol Login */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? 'Memuat...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Atau login dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login (opsional, untuk tampilan) */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-google" size={22} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="finger-print-outline" size={22} color="#0F6FAF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="id-card-outline" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Link Daftar */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#26B7D8',
  },
  scroll: {
    flexGrow: 1,
  },

  // ===== HEADER =====
  header: {
    // backgroundColor dihapus karena sekarang pakai LinearGradient
    paddingTop: 50,
    paddingHorizontal: 28,
    paddingBottom: 70,
    overflow: 'hidden',
    position: 'relative',
  },
  cornerAccent: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.4, // Memberikan efek glow/watermark yang menyatu dengan biru
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 60,
    right: 30,
  },
  headerContent: {
    zIndex: 2,
  },
  plnBadge: {
    width: 60,
    height: 60,
    borderRadius: 16, // Sedikit membulat (rounded box) sesuai gambar
    backgroundColor: '#FFFFFF',
    borderWidth: 0, // Dihilangkan agar gambar terlihat bersih
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 3, // Bayangan halus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Agar gambar tidak keluar dari border radius
  },
  plnLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
  },
  helloText: {
    fontSize: 42,
    fontWeight: '900',
    fontFamily: 'Nunito_800ExtraBold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: -4, // Mepet dengan subText
  },
  subText: {
    fontSize: 15,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  boltDecor: {
    position: 'absolute',
    right: -50,
    top: -20,
    zIndex: 1,
    transform: [{ rotate: '10deg' }], // Sedikit dimiringkan agar lebih dinamis
  },

  // ===== CARD =====
  card: {
    backgroundColor: '#fff',
    marginTop: -40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
    flex: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F6FAF',
    marginBottom: 28,
  },

  // Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e8ecf0',
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },

  // Lupa Password
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: '#0F6FAF',
    fontWeight: '600',
  },

  // Tombol Login
  loginBtn: {
    backgroundColor: '#7ED957',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#7ED957',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    marginBottom: 24,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8ecf0',
  },
  dividerText: {
    fontSize: 12,
    color: '#aaa',
    marginHorizontal: 12,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 28,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e8ecf0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // Register
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#888',
  },
  registerLink: {
    fontSize: 14,
    color: '#0F6FAF',
    fontWeight: '700',
  },
});
