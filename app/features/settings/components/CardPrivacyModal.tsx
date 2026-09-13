import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CardDto } from '@veya/shared';
import { Toast } from '../../../components/Toast';

export interface CardPrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  cards: CardDto[];
  onSetVisibility: (cardId: string, isPublished: boolean) => Promise<void>;
}

export const CardPrivacyModal: React.FC<CardPrivacyModalProps> = ({
  visible,
  onClose,
  cards,
  onSetVisibility,
}) => {
  const [updatingCardId, setUpdatingCardId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastIcon, setToastIcon] = useState<keyof typeof Feather.glyphMap>('globe');
  const [toastIconBg, setToastIconBg] = useState<string>('#10B981');
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggle = async (cardId: string, nextValue: boolean) => {
    try {
      setUpdatingCardId(cardId);
      await onSetVisibility(cardId, nextValue);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToastMessage(nextValue ? 'Card is Public' : 'Card is Private');
      setToastIcon(nextValue ? 'globe' : 'lock');
      setToastIconBg(nextValue ? '#10B981' : '#64748B');
      setToastVisible(true);

      toastTimeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    } catch (err) {
      console.warn('[CardPrivacyModal] Toggle error:', err);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToastMessage('Failed to update card visibility');
      setToastIcon('alert-circle');
      setToastIconBg('#EF4444');
      setToastVisible(true);

      toastTimeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2500);
    } finally {
      setUpdatingCardId(null);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitles}>
              <Text style={styles.title}>Card Privacy & Security</Text>
              <Text style={styles.subtitle}>
                Choose which business cards can be viewed publicly
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close privacy settings"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Guidance Banner */}
          <View style={styles.noticeBanner}>
            <Feather name="shield" size={16} color="#0F172A" style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Private cards display <Text style={styles.noticeBold}>"The Card Details are Private or Not Available."</Text> to anyone who scans your QR code or opens your card link.
            </Text>
          </View>

          {/* Cards List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {cards.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="credit-card" size={32} color="#94A3B8" />
                <Text style={styles.emptyText}>No cards available to configure</Text>
              </View>
            ) : (
              cards.map((item, index) => {
                const isPublished = item.isPublished !== false;
                const isUpdating = updatingCardId === item.id;

                return (
                  <View key={item.id} style={styles.cardItemWrapper}>
                    <View style={styles.cardItem}>
                      {/* Left: Card Info */}
                      <View style={styles.cardInfo}>
                        <View style={styles.titleRow}>
                          <View
                            style={[
                              styles.colorDot,
                              { backgroundColor: item.primaryColor || '#111111' },
                            ]}
                          />
                          <Text style={styles.cardName} numberOfLines={1}>
                            {item.name || 'Untitled Card'}
                          </Text>
                          {item.isDefault && (
                            <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>Default</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.cardMeta} numberOfLines={1}>
                          {item.role ? `${item.role}` : ''}
                          {item.role && item.company ? ' • ' : ''}
                          {item.company ? `${item.company}` : ''}
                          {!item.role && !item.company ? 'Digital Business Card' : ''}
                        </Text>

                        {/* Status Badge */}
                        <View style={styles.statusRow}>
                          <View
                            style={[
                              styles.statusPill,
                              isPublished ? styles.statusPillPublic : styles.statusPillPrivate,
                            ]}
                          >
                            <Feather
                              name={isPublished ? 'globe' : 'lock'}
                              size={11}
                              color={isPublished ? '#059669' : '#64748B'}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                styles.statusPillText,
                                isPublished ? styles.statusTextPublic : styles.statusTextPrivate,
                              ]}
                            >
                              {isPublished ? 'Public Card' : 'Private Card'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Right: Toggle Switch */}
                      <View style={styles.switchWrapper}>
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#0F172A" />
                        ) : (
                          <Switch
                            value={isPublished}
                            onValueChange={(nextVal) => handleToggle(item.id, nextVal)}
                            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#E2E8F0"
                          />
                        )}
                      </View>
                    </View>

                    {index < cards.length - 1 && <View style={styles.itemDivider} />}
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Toggle Toast */}
          <Toast
            visible={toastVisible}
            message={toastMessage}
            icon={toastIcon}
            iconBgColor={toastIconBg}
            bottomOffset={90}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitles: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    padding: 12,
  },
  noticeIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  noticeBold: {
    fontWeight: '600',
    color: '#0F172A',
  },
  scrollList: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  cardItemWrapper: {
    paddingVertical: 12,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
  defaultBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  cardMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPillPublic: {
    backgroundColor: '#ECFDF5',
  },
  statusPillPrivate: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextPublic: {
    color: '#059669',
  },
  statusTextPrivate: {
    color: '#64748B',
  },
  switchWrapper: {
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  doneButton: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
