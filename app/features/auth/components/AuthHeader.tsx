import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>V</Text>
        </View>
        <Text style={styles.brand} accessibilityRole="header">
          veya
        </Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#0F172A',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
    letterSpacing: -0.2,
  },
});
