import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { EditCardModalProps } from '../../types/card-form.types';
import { useCardGestures } from '../../hooks/useCardGestures';
import { useCardForm } from '../../hooks/useCardForm';
import { EditCardPersonalTab } from './EditCardPersonalTab';
import { EditCardContactTab } from './EditCardContactTab';
import { EditCardAppearanceTab } from './EditCardAppearanceTab';

export const EditCardModal: React.FC<EditCardModalProps> = ({
  visible,
  onClose,
  cardData,
  onSave,
  mode = 'edit',
}) => {
  const isCreateMode = mode === 'create';
  const { translateY, backdropOpacity, handleDismiss, panHandlers } = useCardGestures({
    visible,
    onClose,
  });

  const {
    formState,
    setters,
    activeTab,
    setActiveTab,
    isSaving,
    initials,
    previewUser,
    handlePickAvatar,
    handlePickCompanyLogo,
    handleSave,
  } = useCardForm({
    visible,
    cardData,
    onSave,
    onSuccess: handleDismiss,
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleDismiss}
    >
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
        {/* Tap outside modal to close */}
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <View style={styles.backdropDismissArea} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheetContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Top Drag Area (Drag Handle + Header) */}
            <View {...panHandlers} style={styles.dragArea}>
              <View style={styles.dragHandleHitSlop}>
                <View style={styles.dragHandle} />
              </View>

              {/* Modal Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>
                    {isCreateMode ? 'Create New Card' : 'Edit Business Card'}
                  </Text>
                  <Text style={styles.sheetSubtitle}>
                    {isCreateMode
                      ? 'Fill in your details below to create an independent digital business card.'
                      : 'Update your information below. Changes will be reflected on your card immediately.'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleDismiss}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.closeButton}
                  accessibilityLabel="Close modal"
                >
                  <Feather name="x" size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3 STICKY TABS */}
            <View style={styles.tabBarContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]}
                onPress={() => setActiveTab('personal')}
                activeOpacity={0.75}
              >
                <Feather
                  name="user"
                  size={14}
                  color={activeTab === 'personal' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'personal' && styles.tabButtonTextActive,
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'contact' && styles.tabButtonActive]}
                onPress={() => setActiveTab('contact')}
                activeOpacity={0.75}
              >
                <Feather
                  name="phone"
                  size={14}
                  color={activeTab === 'contact' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'contact' && styles.tabButtonTextActive,
                  ]}
                >
                  Contact
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'preview' && styles.tabButtonActive]}
                onPress={() => setActiveTab('preview')}
                activeOpacity={0.75}
              >
                <Feather
                  name="eye"
                  size={14}
                  color={activeTab === 'preview' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'preview' && styles.tabButtonTextActive,
                  ]}
                >
                  Preview & Style
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Form Content */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {activeTab === 'personal' && (
                <EditCardPersonalTab
                  avatarUrl={formState.avatarUrl}
                  companyLogoUrl={formState.companyLogoUrl}
                  initials={initials}
                  name={formState.name}
                  role={formState.role}
                  company={formState.company}
                  slogan={formState.slogan}
                  onPickAvatar={handlePickAvatar}
                  onPickCompanyLogo={handlePickCompanyLogo}
                  onChangeName={setters.setName}
                  onChangeRole={setters.setRole}
                  onChangeCompany={setters.setCompany}
                  onChangeSlogan={setters.setSlogan}
                />
              )}

              {activeTab === 'contact' && (
                <EditCardContactTab
                  phoneNumber={formState.phoneNumber}
                  email={formState.email}
                  location={formState.location}
                  website={formState.website}
                  socialLinks={formState.socialLinks || []}
                  onChangePhoneNumber={setters.setPhoneNumber}
                  onChangeEmail={setters.setEmail}
                  onChangeLocation={setters.setLocation}
                  onChangeWebsite={setters.setWebsite}
                  onChangeSocialLinks={setters.setSocialLinks}
                />
              )}

              {activeTab === 'preview' && (
                <EditCardAppearanceTab
                  primaryColor={formState.primaryColor}
                  cardBackgroundColor={formState.cardBackgroundColor}
                  fontFamily={formState.fontFamily}
                  backgroundStyle={formState.backgroundStyle}
                  onSelectPrimaryColor={setters.setPrimaryColor}
                  onSelectCardBackgroundColor={setters.setCardBackgroundColor}
                  onSelectFontFamily={setters.setFontFamily}
                  onSelectBackgroundStyle={setters.setBackgroundStyle}
                  previewUser={previewUser}
                  location={formState.location}
                  website={formState.website}
                  slogan={formState.slogan}
                  companyLogoUrl={formState.companyLogoUrl}
                />
              )}
            </ScrollView>

            {/* Bottom Sticky Action Button */}
            <View style={styles.stickyFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
                activeOpacity={0.85}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {isCreateMode ? 'Create Card' : 'Save Changes'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropDismissArea: {
    ...StyleSheet.absoluteFill,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    width: '100%',
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  dragArea: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  dragHandleHitSlop: {
    paddingTop: 6,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  tabBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0F172A',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollArea: {
    maxHeight: 480,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
