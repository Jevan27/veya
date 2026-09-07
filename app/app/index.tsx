import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { BottomNavBar, TabType } from '../components/navigation/BottomNavBar';
import { CardsTab } from '../features/cards/components/CardsTab';
import { SettingsTab } from '../features/settings/components/SettingsTab';
import { QuickScanModal } from '../features/scanner/components/QuickScanModal';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, updateUser, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('cards');
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (!isLoading && isAuthenticated && user && user.onboardingCompleted === false) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.brand}>veya</Text>
        <ActivityIndicator size="small" color="#111111" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.body}>
        {activeTab === 'cards' ? (
          <CardsTab
            user={user}
            onOpenScanner={() => setIsScannerVisible(true)}
            onUserUpdate={updateUser}
          />
        ) : (
          <SettingsTab
            user={user}
            onUserUpdate={updateUser}
            onSignOut={handleSignOut}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onCameraPress={() => setIsScannerVisible(true)}
      />

      {/* Quick QR Scanner Camera Modal */}
      <QuickScanModal
        visible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#111111',
    marginBottom: 32,
  },
});
