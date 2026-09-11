import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LegalDocumentData } from './content';

interface LegalScreenViewProps {
  data: LegalDocumentData;
  alternateRoute: '/legal/terms' | '/legal/privacy';
  alternateLabel: string;
}

export const LegalScreenView: React.FC<LegalScreenViewProps> = ({
  data,
  alternateRoute,
  alternateLabel,
}) => {
  const router = useRouter();

  const handleOpenBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(data.webUrl);
      if (supported) {
        await Linking.openURL(data.webUrl);
      }
    } catch (error) {
      console.warn('Failed to open legal URL in browser:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top App Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={20} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.navTitle} numberOfLines={1}>
          {data.title}
        </Text>

        <TouchableOpacity
          onPress={handleOpenBrowser}
          style={styles.browserButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Open on web"
        >
          <Feather name="external-link" size={18} color="#111111" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* Document Header Box */}
        <View style={styles.docHeaderCard}>
          <View style={styles.badge}>
            <Feather
              name={data.title === 'Terms of Service' ? 'file-text' : 'shield'}
              size={12}
              color="#111111"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.badgeText}>{data.badge}</Text>
          </View>

          <Text style={styles.docTitle}>{data.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Effective Date:</Text>
            <Text style={styles.metaValue}>{data.effectiveDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Entity:</Text>
            <Text style={styles.metaValue}>{data.entityName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Office:</Text>
            <Text style={styles.metaValue} numberOfLines={2}>
              {data.entityAddress}
            </Text>
          </View>
        </View>

        {/* Sections */}
        {data.sections.map((section, index) => (
          <View key={index} style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content.map((paragraph, pIndex) => (
              <Text key={pIndex} style={styles.sectionParagraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        {/* Footer Navigation Switch */}
        <View style={styles.footerCard}>
          <Text style={styles.footerCardText}>
            Need to review our other legal policies?
          </Text>
          <TouchableOpacity
            style={styles.alternateButton}
            onPress={() => router.push(alternateRoute)}
            activeOpacity={0.7}
          >
            <Text style={styles.alternateButtonText}>
              View {alternateLabel}
            </Text>
            <Feather name="arrow-right" size={15} color="#111111" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Web Disclaimer Box */}
        <View style={styles.counselNotice}>
          <Text style={styles.counselNoticeText}>
            For the complete unabridged legal documentation, table of contents, and official regulatory filings, visit{' '}
            <Text style={styles.linkInline} onPress={handleOpenBrowser}>
              {data.webUrl}
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.2,
  },
  browserButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },
  docHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  docTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    width: 100,
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  sectionParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 10,
  },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerCardText: {
    fontSize: 13.5,
    color: '#6B7280',
    marginBottom: 12,
  },
  alternateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  alternateButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111111',
  },
  counselNotice: {
    padding: 14,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  counselNoticeText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#92400E',
    textAlign: 'center',
  },
  linkInline: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: '#78350F',
  },
});
