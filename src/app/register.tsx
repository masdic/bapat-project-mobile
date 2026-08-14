import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, Alert, Platform, useWindowDimensions,
  KeyboardAvoidingView, ScrollView, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = Platform.OS === 'web'
  ? 'http://127.0.0.1:8000/api'
  : 'http://10.84.239.170:8000/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;

  const [kodeRegistrasi, setKodeRegistrasi] = useState('');
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [role, setRole] = useState('petugas');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!kodeRegistrasi || !name || !nip || !email || !password || !passwordConfirm) {
      Alert.alert('Perhatian', 'Semua field wajib diisi.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Perhatian', 'Konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Perhatian', 'Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        kode_registrasi: kodeRegistrasi,
        name,
        id_pegawai: nip,
        email,
        no_hp: noHp || null,
        role,
        password,
        password_confirmation: passwordConfirm,
      });

      const token = response.data.access_token;
      await AsyncStorage.setItem('userToken', token);

      Alert.alert('Berhasil! 🎉', response.data.message, [
        { text: 'Masuk', onPress: () => router.replace('/home') }
      ]);
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors).flat()[0] as string;
        Alert.alert('Pendaftaran Gagal', firstError);
      } else {
        const msg = error?.response?.data?.message || 'Tidak dapat terhubung ke server.';
        Alert.alert('Pendaftaran Gagal', msg);
      }
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
          {/* ===== HEADER GRADIENT ===== */}
          <LinearGradient
            colors={['#0F6FAF', '#26B7D8']}
            style={[styles.header, { minHeight: isTablet ? height * 0.22 : height * 0.25 }]}
          >
            <LinearGradient
              colors={['#F7D117', '#F5C400']}
              style={styles.cornerAccent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.helloText}>Daftar Akun</Text>
              <Text style={styles.subText}>
                Buat akun baru untuk mengakses{'\n'}aplikasi BAPAT Mobile
              </Text>
            </View>

            <View style={styles.boltDecor}>
              <MaterialIcons name="person-add" size={180} color="rgba(21, 101, 192, 0.12)" />
            </View>
          </LinearGradient>

          {/* ===== FORM CARD ===== */}
          <View style={[styles.card, { maxWidth: cardMaxWidth, alignSelf: 'center', width: '100%' }]}>
            <Text style={styles.sectionTitle}>Informasi Registrasi</Text>

            {/* Kode Registrasi */}
            <View style={styles.inputWrapper}>
              <Ionicons name="key-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Kode Registrasi PLN"
                placeholderTextColor="#bbb"
                value={kodeRegistrasi}
                onChangeText={setKodeRegistrasi}
                autoCapitalize="characters"
              />
            </View>

            {/* Nama Lengkap */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* NIP */}
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="NIP / ID Pegawai"
                placeholderTextColor="#bbb"
                value={nip}
                onChangeText={setNip}
                keyboardType="numeric"
              />
            </View>

            {/* Email */}
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
              />
            </View>

            {/* No HP */}
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="No. HP (opsional)"
                placeholderTextColor="#bbb"
                value={noHp}
                onChangeText={setNoHp}
                keyboardType="phone-pad"
              />
            </View>

            {/* Role Selector */}
            <Text style={styles.labelText}>Jabatan</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'petugas' && styles.roleBtnActive]}
                onPress={() => setRole('petugas')}
              >
                <Ionicons name="construct-outline" size={18} color={role === 'petugas' ? '#fff' : '#0F6FAF'} />
                <Text style={[styles.roleBtnText, role === 'petugas' && styles.roleBtnTextActive]}>Petugas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'supervisor' && styles.roleBtnActive]}
                onPress={() => setRole('supervisor')}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color={role === 'supervisor' ? '#fff' : '#0F6FAF'} />
                <Text style={[styles.roleBtnText, role === 'supervisor' && styles.roleBtnTextActive]}>Supervisor</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Keamanan</Text>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password (min. 6 karakter)"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Konfirmasi Password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-open-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Konfirmasi Password"
                placeholderTextColor="#bbb"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            {/* Tombol Daftar */}
            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.registerBtnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>Daftar Sekarang</Text>
              )}
            </TouchableOpacity>

            {/* Link Login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#26B7D8' },
  scroll: { flexGrow: 1 },

  // Header
  header: {
    paddingTop: 50, paddingHorizontal: 28, paddingBottom: 50,
    overflow: 'hidden', position: 'relative',
  },
  cornerAccent: {
    position: 'absolute', top: -40, right: -40,
    width: 180, height: 180, borderRadius: 90, opacity: 0.4,
  },
  circle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -50,
  },
  circle2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)', top: 60, right: 30,
  },
  headerContent: { zIndex: 2 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  helloText: {
    fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 1, marginBottom: -2,
  },
  subText: {
    fontSize: 14, color: '#FFFFFF', lineHeight: 20, letterSpacing: 0.3,
  },
  boltDecor: {
    position: 'absolute', right: -30, top: -10, zIndex: 1,
    transform: [{ rotate: '10deg' }],
  },

  // Card
  card: {
    backgroundColor: '#fff', marginTop: -30,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 28, paddingTop: 30, paddingBottom: 40, flex: 1,
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: '#0F6FAF', marginBottom: 16,
  },
  labelText: {
    fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8, marginLeft: 2,
  },

  // Input
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f7fa', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#e8ecf0',
    marginBottom: 14, paddingHorizontal: 14, height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#333', height: '100%' },
  eyeIcon: { padding: 4 },

  // Role selector
  roleRow: {
    flexDirection: 'row', gap: 12, marginBottom: 8,
  },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: '#0F6FAF',
    backgroundColor: '#fff', gap: 6,
  },
  roleBtnActive: {
    backgroundColor: '#0F6FAF', borderColor: '#0F6FAF',
  },
  roleBtnText: { fontSize: 14, fontWeight: '600', color: '#0F6FAF' },
  roleBtnTextActive: { color: '#fff' },

  // Register button
  registerBtn: {
    backgroundColor: '#7ED957', height: 54, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#7ED957',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
    marginTop: 12, marginBottom: 20,
  },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },

  // Login link
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 14, color: '#888' },
  loginLink: { fontSize: 14, color: '#0F6FAF', fontWeight: '700' },
});
