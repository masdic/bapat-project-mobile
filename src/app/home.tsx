import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, Dimensions, Alert, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = Platform.OS === 'web'
  ? 'http://127.0.0.1:8000/api'
  : 'http://10.0.2.2:8000/api';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) { router.replace('/'); return; }
      const res = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (e: any) {
      if (e.response?.status === 401) handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (_) {}
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER BIRU */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user ? user.name.charAt(0) : 'M'}
              </Text>
            </View>
            <View style={styles.logoArea}>
              <Text style={styles.logoText}>BAPAT</Text>
              <Text style={styles.logoSub}>U P T  M a d i u n</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.notifWrapper}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceLabel}>Saldo Rekening Utama</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>Rp 100.000.000,00</Text>
            <Ionicons name="eye-outline" size={20} color="rgba(255,255,255,0.8)" style={{ marginLeft: 8 }} />
          </View>
          <TouchableOpacity style={styles.otherAccBtn}>
            <Text style={styles.otherAccText}>Rekening Lain</Text>
          </TouchableOpacity>
        </View>

        {/* MENU CARD MELAYANG */}
        <View style={styles.menuCard}>
          <View style={styles.menuRow}>
            <MenuItem icon="cash-outline" label="Tarik Tunai" />
            <MenuItem icon="swap-horizontal-outline" label="Transfer" />
            <MenuItem icon="download-outline" label="Setor Tunai" />
            <MenuItem icon="wallet-outline" label="Dompet Digital" />
          </View>
          <View style={[styles.menuRow, { marginTop: 22 }]}>
            <MenuItem icon="phone-portrait-outline" label="Pulsa/Data" />
            <MenuItem icon="cart-outline" label="E-Commerce" />
            <MenuItem icon="flash-outline" label="Listrik" />
            <MenuItem icon="ellipsis-horizontal" label="Lainnya" />
          </View>
        </View>

        {/* CONTENT AREA */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Dompet Digital</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <EwalletCard color="#00B14F" icon="💚" name="GoPay" action="Hubungkan" />
            <EwalletCard color="#4C3494" icon="💜" name="OVO" action="Hubungkan" />
            <EwalletCard color="#003C96" icon="💙" name="DANA" action="Hubungkan" />
          </ScrollView>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Catatan Keuangan</Text>
            <TouchableOpacity><Text style={styles.linkText}>Lihat Detail</Text></TouchableOpacity>
          </View>

          <View style={styles.financeCard}>
            <View style={styles.financeRow}>
              <View style={styles.financeCol}>
                <View style={styles.financeLabel}>
                  <Ionicons name="arrow-down" size={14} color="#00c853" />
                  <Text style={styles.financeLabelText}>Pemasukan</Text>
                </View>
                <Text style={styles.financeAmount}>Rp0</Text>
              </View>
              <View style={styles.financeDivider} />
              <View style={styles.financeCol}>
                <View style={styles.financeLabel}>
                  <Ionicons name="arrow-up" size={14} color="#ff1744" />
                  <Text style={styles.financeLabelText}>Pengeluaran</Text>
                </View>
                <Text style={styles.financeAmount}>Rp0</Text>
              </View>
            </View>
            <View style={styles.financeFooter}>
              <Text style={styles.financeFooterText}>
                Selisih{' '}<Text style={{ color: '#00c853', fontWeight: 'bold' }}>Rp0</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" active />
        <NavItem icon="list-outline" label="Mutasi" />
        <View style={styles.qrisOuter}>
          <View style={styles.qrisInner}>
            <Ionicons name="qr-code-outline" size={28} color="#fff" />
          </View>
        </View>
        <NavItem icon="mail-outline" label="Aktivitas" />
        <NavItem icon="person-outline" label="Akun" />
      </View>
    </SafeAreaView>
  );
}

const MenuItem = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.menuItem}>
    <View style={styles.menuIconCircle}>
      <Ionicons name={icon} size={26} color="#0055b3" />
    </View>
    <Text style={styles.menuItemText}>{label}</Text>
  </View>
);

const EwalletCard = ({ color, icon, name, action }: any) => (
  <View style={styles.ewalletCard}>
    <View style={[styles.ewalletIcon, { backgroundColor: color + '22' }]}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.ewalletName}>{name}</Text>
      <Text style={[styles.ewalletAction, { color }]}>{action}</Text>
    </View>
  </View>
);

const NavItem = ({ icon, label, active }: { icon: any; label: string; active?: boolean }) => (
  <View style={styles.navItem}>
    <Ionicons name={active ? icon : icon} size={22} color={active ? '#0055b3' : '#aaa'} />
    <Text style={[styles.navLabel, active && { color: '#0055b3' }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },

  // HEADER
  header: {
    backgroundColor: '#0055b3',
    paddingTop: 44, paddingHorizontal: 22, paddingBottom: 60,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 28,
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center'
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  logoArea: { alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  logoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 9, letterSpacing: 3 },
  notifWrapper: { position: 'relative', padding: 4 },
  notifBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#ff3d00', borderWidth: 1.5, borderColor: '#0055b3'
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, textAlign: 'center', marginBottom: 6 },
  balanceRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  balanceAmount: { color: '#fff', fontSize: 26, fontWeight: '800' },
  otherAccBtn: {
    alignSelf: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 18,
  },
  otherAccText: { color: '#fff', fontSize: 12 },

  // MENU CARD
  menuCard: {
    backgroundColor: '#fff', marginHorizontal: 18, marginTop: -42,
    borderRadius: 22, padding: 20, elevation: 8,
    shadowColor: '#0055b3', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 10, zIndex: 10,
  },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between' },
  menuItem: { alignItems: 'center', width: (width - 36 - 40) / 4 },
  menuIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#e8f1fb', justifyContent: 'center', alignItems: 'center', marginBottom: 7,
  },
  menuItemText: { fontSize: 10, color: '#444', textAlign: 'center', lineHeight: 13 },

  // CONTENT
  content: { paddingHorizontal: 18, paddingTop: 22 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 14 },
  linkText: { fontSize: 12, color: '#0055b3' },

  ewalletCard: {
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    padding: 14, borderRadius: 16, marginRight: 12, width: width * 0.55,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4,
  },
  ewalletIcon: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  ewalletName: { fontSize: 13, fontWeight: '700', color: '#333' },
  ewalletAction: { fontSize: 12, marginTop: 2, fontWeight: '600' },

  financeCard: {
    backgroundColor: '#fff', borderRadius: 16,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4,
  },
  financeRow: { flexDirection: 'row', padding: 20 },
  financeCol: { flex: 1, alignItems: 'center' },
  financeDivider: { width: 1, backgroundColor: '#eee', marginHorizontal: 10 },
  financeLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  financeLabelText: { fontSize: 12, color: '#777', marginLeft: 4 },
  financeAmount: { fontSize: 17, fontWeight: '700', color: '#222' },
  financeFooter: {
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    paddingVertical: 14, alignItems: 'center'
  },
  financeFooterText: { fontSize: 13, color: '#777' },

  // BOTTOM NAV
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 72, backgroundColor: '#fff',
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', paddingBottom: 8,
    elevation: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  navItem: { alignItems: 'center', width: 55 },
  navLabel: { fontSize: 10, color: '#aaa', marginTop: 3 },
  qrisOuter: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#e8f1fb', justifyContent: 'center',
    alignItems: 'center', marginTop: -28,
  },
  qrisInner: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#0055b3', justifyContent: 'center', alignItems: 'center',
  },
});
