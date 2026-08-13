import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// IP Address laptop di jaringan Hotspot HP
const API_URL = 'http://10.84.239.170:8000/api'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validasi form kosong
    if (!email || !password) {
      Alert.alert('Peringatan', 'Email dan password tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      
      const token = response.data.access_token;
      await AsyncStorage.setItem('userToken', token);
      
      // Arahkan ke Home
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Email atau password salah. Cek koneksi server Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Bagian Atas - Latar Biru */}
      <View style={styles.topSection}>
        <Text style={styles.logoText}>BAPAT</Text>
        <Text style={styles.logoSubText}>Sistem Manajemen Aktiva</Text>
        
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Halo, Admin PLN</Text>
          <Text style={styles.greetingText}>Selamat Datang!</Text>
        </View>

        <View style={styles.illustrationPlaceholder}>
          <Ionicons name="people-outline" size={100} color="rgba(255,255,255,0.3)" />
        </View>
      </View>

      {/* Bagian Bawah - Kartu Putih Melengkung */}
      <View style={styles.bottomCard}>
        
        <View style={styles.fastMenuHeader}>
          <Text style={styles.fastMenuTitle}>Fast Menu</Text>
          <Ionicons name="information-circle-outline" size={18} color="#0066cc" style={{ marginLeft: 5 }} />
        </View>

        <View style={styles.menuGrid}>
          <View style={styles.menuItem}>
            <View style={styles.iconCircle}><Ionicons name="book-outline" size={24} color="#0066cc" /></View>
            <Text style={styles.menuText}>Catatan{"\n"}Keuangan</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.iconCircle}><Ionicons name="card-outline" size={24} color="#0066cc" /></View>
            <Text style={styles.menuText}>UNPIX{"\n"}Money</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.iconCircle}><Ionicons name="wallet-outline" size={24} color="#0066cc" /></View>
            <Text style={styles.menuText}>Dompet{"\n"}Digital</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.iconCircle}><Ionicons name="phone-portrait-outline" size={24} color="#0066cc" /></View>
            <Text style={styles.menuText}>Pulsa/{"\n"}Data</Text>
          </View>
        </View>

        {/* Form Input Email & Password (DITAMBAHKAN) */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email PLN"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
        
        {/* Tombol Aksi */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Memuat...' : 'Login'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.fingerprintButton}>
            <Ionicons name="finger-print-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066cc', 
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  logoSubText: {
    fontSize: 14,
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 20,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  illustrationPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCard: {
    backgroundColor: '#fff',
    height: height * 0.58, // Sedikit ditinggikan agar form muat
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  fastMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  fastMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItem: {
    alignItems: 'center',
    width: width / 5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f0fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  
  /* --- STYLE BARU UNTUK FORM INPUT --- */
  formContainer: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderWidth: 1,
    borderColor: '#e1e5ec',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#333',
  },
  /* ---------------------------------- */

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fingerprintButton: {
    width: 55,
    height: 55,
    backgroundColor: '#0066cc',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
