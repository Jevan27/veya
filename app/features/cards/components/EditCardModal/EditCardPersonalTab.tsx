import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MediaPickerCard } from './MediaPickerCard';

interface EditCardPersonalTabProps {
  avatarUrl: string | null;
  companyLogoUrl: string | null;
  initials: string;
  name: string;
  role: string;
  company: string;
  slogan: string;
  onPickAvatar: () => void;
  onPickCompanyLogo: () => void;
  onChangeName: (val: string) => void;
  onChangeRole: (val: string) => void;
  onChangeCompany: (val: string) => void;
  onChangeSlogan: (val: string) => void;
}

export const EditCardPersonalTab: React.FC<EditCardPersonalTabProps> = ({
  avatarUrl,
  companyLogoUrl,
  initials,
  name,
  role,
  company,
  slogan,
  onPickAvatar,
  onPickCompanyLogo,
  onChangeName,
  onChangeRole,
  onChangeCompany,
  onChangeSlogan,
}) => {
  return (
    <>
      {/* Media Uploads Row: Profile Photo & Company Logo Cards */}
      <View style={styles.mediaRow}>
        <MediaPickerCard
          title="Profile Photo"
          subtitle="Tap to change"
          imageUri={avatarUrl}
          fallbackText={initials}
          isCircle={true}
          onPress={onPickAvatar}
        />
        <MediaPickerCard
          title="Company Logo"
          subtitle="Tap to change"
          imageUri={companyLogoUrl}
          fallbackText="v"
          isCircle={false}
          onPress={onPickCompanyLogo}
        />
      </View>

      {/* Full Name */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="user" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Full Name</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={onChangeName}
          placeholder="e.g. Jevan Campillos"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
        />
      </View>

      {/* Job Title / Role */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="briefcase" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Job Title / Role</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={role}
          onChangeText={onChangeRole}
          placeholder="e.g. Full-Stack Developer"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Company Name */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="grid" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Company Name</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={company}
          onChangeText={onChangeCompany}
          placeholder="e.g. Veya"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Slogan / Tagline */}
      <View style={styles.formFieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Feather name="message-square" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>Slogan / Tagline</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={slogan}
          onChangeText={onChangeSlogan}
          placeholder="e.g. PEOPLE&#10;IDEAS&#10;OPPORTUNITIES&#10;CONNECTED"
          placeholderTextColor="#94A3B8"
          multiline
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mediaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formFieldContainer: {
    marginBottom: 16,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },
});
