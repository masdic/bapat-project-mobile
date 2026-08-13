import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { API_URL } from '../config';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.log('Error during logout API call', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Biru */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.profileBadge}><Text style={styles.profileBadgeText}>M</Text></View>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>UNPIX</Text>
              <Text style={styles.logoSubText}>M o b i l e</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {/* Notif badge */}
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceLabel}>Saldo Rekening Utama</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceText}>Rp 100.000.000,00</Text>
            <Ionicons name="eye-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
          </View>

          <TouchableOpacity style={styles.otherAccountBtn}>
            <Text style={styles.otherAccountText}>Rekening Lain</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Utama (Melayang/Card) */}
        <View style={styles.mainMenuCard}>
          <View style={styles.menuRow}>
            <MenuItem icon="cash-outline" label="Tarik Tunai" />
            <MenuItem icon="swap-horizontal-outline" label="Transfer" />
            <MenuItem icon="download-outline" label="Setor Tunai" />
            <MenuItem icon="wallet-outline" label="Dompet Digital" />
          </View>
          <View style={[styles.menuRow, { marginTop: 20 }]}>
            <MenuItem icon="phone-portrait-outline" label="Pulsa/Data" />
            <MenuItem icon="cart-outline" label="E-Commerce" />
            <MenuItem icon="flash-outline" label="Listrik" />
            <MenuItem icon="ellipsis-horizontal" label="Lainnya" />
          </View>
        </View>

        {/* Bagian Bawah Header Biru (Melengkung) */}
        <View style={styles.blueBackgroundExtension} />

        {/* Konten Dompet Digital & Catatan */}
        <View style={styles.contentSection}>
          {/* Dompet Digital */}
          <Text style={styles.sectionTitle}>Dompet Digital</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <View style={styles.ewalletCard}>
              <View style={styles.ewalletIcon}><Text style={{fontWeight: 'bold', color: '#00cc66'}}>gopay</Text></View>
              <View>
                <Text style={styles.ewalletName}>GoPay</Text>
                <Text style={styles.ewalletAction}>Hubungkan</Text>
              </View>
            </View>
            <View style={styles.ewalletCard}>
              <View style={styles.ewalletIcon}><Ionicons name="wallet" size={24} color="#fca311" /></View>
              <View>
                <Text style={styles.ewalletName}>OVO</Text>
                <Text style={styles.ewalletAction}>Hubungkan</Text>
              </View>
            </View>
          </ScrollView>

          {/* Catatan Keuangan */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Catatan Keuangan</Text>
            <TouchableOpacity><Text style={styles.seeDetailText}>Lihat Detail</Text></TouchableOpacity>
          </View>
          
          <View style={styles.financeCard}>
            <View style={styles.financeRow}>
              <View style={styles.financeCol}>
                <View style={styles.financeLabelRow}>
                  <Ionicons name="arrow-down" size={16} color="#00cc66" />
                  <Text style={styles.financeLabel}>Pemasukan</Text>
                </View>
                <Text style={styles.financeValue}>Rp0</Text>
              </View>
              <View style={styles.financeDivider} />
              <View style={styles.financeCol}>
                <View style={styles.financeLabelRow}>
                  <Ionicons name="arrow-up" size={16} color="#ff3333" />
                  <Text style={styles.financeLabel}>Pengeluaran</Text>
                </View>
                <Text style={styles.financeValue}>Rp0</Text>
              </View>
            </View>
            <View style={styles.financeFooter}>
              <Text style={styles.financeFooterText}>Selisih <Text style={{color: '#00cc66', fontWeight: 'bold'}}>Rp0</Text></Text>
            </View>
          </View>
        </View>

        <View style={{height: 100}} /> {/* Spacer untuk bottom nav */}
      </ScrollView>

      {/* Custom Bottom Navigation (Mockup) */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={24} color="#0066cc" />
          <Text style={[styles.navText, {color: '#0066cc'}]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="list-outline" size={24} color="#999" />
          <Text style={styles.navText}>Mutasi</Text>
        </View>
        
        {/* Tombol QRIS Tengah */}
        <View style={styles.qrisWrapper}>
          <View style={styles.qrisButton}>
            <Ionicons name="qr-code-outline" size={30} color="#fff" />
          </View>
        </View>
        
        <View style={styles.navItem}>
          <Ionicons name="mail-outline" size={24} color="#999" />
          <Text style={styles.navText}>Aktivitas</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navText}>Akun</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const MenuItem = ({ icon, label }) => (
  <View style={styles.menuItem}>
    <View style={styles.menuIconCircle}>
      <Ionicons name={icon} size={28} color="#0066cc" />
    </View>
    <Text style={styles.menuItemText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: {
    backgroundColor: '#0066cc',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileBadge: {
    width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#80b3e6',
    justifyContent: 'center', alignItems: 'center'
  },
  profileBadgeText: { color: '#fff', fontWeight: 'bold' },
  logoContainer: { alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoSubText: { color: '#fff', fontSize: 10, letterSpacing: 2 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff3333',
    borderWidth: 1, borderColor: '#0066cc'
  },
  balanceLabel: { color: '#e6f0fa', fontSize: 14, textAlign: 'center', marginBottom: 5 },
  balanceRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  balanceText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  otherAccountBtn: {
    alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 15,
    borderWidth: 1, borderColor: '#fff', borderRadius: 20,
  },
  otherAccountText: { color: '#fff', fontSize: 12 },
  
  mainMenuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 5,
    zIndex: 3,
  },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between' },
  menuItem: { alignItems: 'center', width: width / 5 },
  menuIconCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#e6f0fa',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8
  },
  menuItemText: { fontSize: 10, color: '#333', textAlign: 'center' },

  contentSection: { padding: 20, zIndex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 15 },
  seeDetailText: { fontSize: 12, color: '#0066cc' },
  
  horizontalScroll: { marginLeft: -5 },
  ewalletCard: {
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    padding: 15, borderRadius: 15, marginLeft: 5, marginRight: 10,
    width: width * 0.6,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  ewalletIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  ewalletName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  ewalletAction: { fontSize: 12, color: '#0066cc', marginTop: 3 },

  financeCard: {
    backgroundColor: '#fff', borderRadius: 15, padding: 20,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  financeCol: { flex: 1, alignItems: 'center' },
  financeDivider: { width: 1, backgroundColor: '#eee', marginHorizontal: 10 },
  financeLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  financeLabel: { fontSize: 12, color: '#666', marginLeft: 5 },
  financeValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  financeFooter: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15, alignItems: 'center' },
  financeFooterText: { fontSize: 14, color: '#666' },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', flexDirection: 'row', height: 70,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    justifyContent: 'space-around', alignItems: 'center',
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5,
  },
  navItem: { alignItems: 'center', width: 50 },
  navText: { fontSize: 10, marginTop: 4 },
  qrisWrapper: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#e6f0fa',
    justifyContent: 'center', alignItems: 'center', marginTop: -30
  },
  qrisButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#0066cc',
    justifyContent: 'center', alignItems: 'center'
  }
});
