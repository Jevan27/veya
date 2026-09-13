import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  SocialLinkDto,
  detectSocialPlatform,
  validateSocialUrl,
} from '@veya/shared';
import { SocialIcon } from '../SocialIcon';

interface SocialLinksManagerProps {
  socialLinks: SocialLinkDto[];
  onChangeSocialLinks: (links: SocialLinkDto[]) => void;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  socialLinks = [],
  onChangeSocialLinks,
}) => {
  // Modal / inline editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Live platform detection as the user enters or changes URL
  const detectedPlatform = useMemo(() => {
    if (!urlInput.trim()) return null;
    return detectSocialPlatform(urlInput.trim());
  }, [urlInput]);

  const handleOpenAdd = () => {
    setEditingLinkId(null);
    setUrlInput('');
    setUrlError(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (link: SocialLinkDto) => {
    setEditingLinkId(link.id);
    setUrlInput(link.url);
    setUrlError(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingLinkId(null);
    setUrlInput('');
    setUrlError(null);
  };

  const handleSaveLink = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError('Please enter a URL');
      return;
    }

    const validation = validateSocialUrl(trimmed);
    if (!validation.isValid || !validation.detected) {
      setUrlError(validation.error || 'Please enter a valid URL');
      return;
    }

    const detected = validation.detected;
    const normalized = detected.normalizedUrl;

    // Check for duplicate URLs (excluding the one being edited)
    const isDuplicate = socialLinks.some(
      (l) => l.id !== editingLinkId && l.url.toLowerCase() === normalized.toLowerCase()
    );

    if (isDuplicate) {
      setUrlError('This social link has already been added');
      return;
    }

    if (editingLinkId) {
      // Editing existing link: re-detect platform and update URL
      const updated = socialLinks.map((l) => {
        if (l.id === editingLinkId) {
          return {
            ...l,
            platform: detected.platform,
            url: normalized,
          };
        }
        return l;
      });
      onChangeSocialLinks(updated);
    } else {
      // Adding brand new link
      const newLink: SocialLinkDto = {
        id: `social-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        platform: detected.platform,
        url: normalized,
        displayOrder: socialLinks.length,
      };
      onChangeSocialLinks([...socialLinks, newLink]);
    }

    handleCloseEditor();
  };

  const handleDeleteLink = (id: string) => {
    Alert.alert(
      'Remove Social Link',
      'Are you sure you want to remove this social link from your card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const filtered = socialLinks
              .filter((l) => l.id !== id)
              .map((l, idx) => ({ ...l, displayOrder: idx }));
            onChangeSocialLinks(filtered);
          },
        },
      ]
    );
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const copy = [...socialLinks];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChangeSocialLinks(copy.map((l, i) => ({ ...l, displayOrder: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index >= socialLinks.length - 1) return;
    const copy = [...socialLinks];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChangeSocialLinks(copy.map((l, i) => ({ ...l, displayOrder: i })));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelWithIcon}>
          <Feather name="share-2" size={15} color="#64748B" style={styles.fieldIcon} />
          <Text style={styles.sectionTitle}>Social Links</Text>
        </View>
        {!isEditorOpen && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleOpenAdd}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add Social Link"
          >
            <Feather name="plus" size={14} color="#0F172A" />
            <Text style={styles.addButtonText}>Add Link</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Inline Add/Edit Form */}
      {isEditorOpen && (
        <View style={styles.editorCard}>
          <Text style={styles.editorTitle}>
            {editingLinkId ? 'Edit Social Link' : 'Add Social Link'}
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.editorInput, !!urlError && styles.editorInputError]}
              value={urlInput}
              onChangeText={(val) => {
                setUrlInput(val);
                if (urlError) setUrlError(null);
              }}
              placeholder="e.g. https://linkedin.com/in/username"
              placeholderTextColor="#94A3B8"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              accessibilityLabel="Social profile or website URL"
            />
          </View>

          {/* Real-time Detection Feedback */}
          {urlInput.trim().length > 0 && (
            <View style={styles.detectedContainer}>
              {detectedPlatform ? (
                <View style={styles.detectedBadge}>
                  <SocialIcon platform={detectedPlatform.platform} size={15} color="#0F172A" />
                  <Text style={styles.detectedText}>
                    Detected: <Text style={styles.detectedBrand}>{detectedPlatform.name}</Text>
                  </Text>
                </View>
              ) : (
                <View style={styles.unrecognizedBadge}>
                  <Feather name="alert-circle" size={14} color="#DC2626" />
                  <Text style={styles.unrecognizedText}>
                    Unrecognized or invalid URL format
                  </Text>
                </View>
              )}
            </View>
          )}

          {urlError && <Text style={styles.errorText}>{urlError}</Text>}

          <View style={styles.editorActionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCloseEditor}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cancel editing social link"
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleSaveLink}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={editingLinkId ? 'Update Link' : 'Add Link'}
            >
              <Text style={styles.confirmBtnText}>
                {editingLinkId ? 'Update Link' : 'Add Link'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List of Configured Social Links */}
      {socialLinks.length === 0 && !isEditorOpen ? (
        <View style={styles.emptyCard}>
          <Feather name="link" size={24} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No social links added yet</Text>
          <Text style={styles.emptySubtitle}>
            Add links to your Facebook, LinkedIn, GitHub, Instagram, and more.
          </Text>
        </View>
      ) : (
        <View style={styles.linksList}>
          {socialLinks.map((link, index) => {
            const platformInfo = detectSocialPlatform(link.url);
            const platformName = platformInfo?.name || link.platform;

            return (
              <View key={link.id} style={styles.linkCard}>
                <View style={styles.iconBox}>
                  <SocialIcon platform={link.platform} size={17} color="#0F172A" />
                </View>

                <View style={styles.linkContent}>
                  <Text style={styles.linkPlatformName}>{platformName}</Text>
                  <Text
                    style={styles.linkUrl}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {link.url}
                  </Text>
                </View>

                {/* Reorder and Edit Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    onPress={() => handleMoveUp(index)}
                    disabled={index === 0}
                    style={[styles.iconButton, index === 0 && styles.iconButtonDisabled]}
                    accessibilityRole="button"
                    accessibilityLabel="Move up"
                  >
                    <Feather
                      name="chevron-up"
                      size={16}
                      color={index === 0 ? '#CBD5E1' : '#64748B'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleMoveDown(index)}
                    disabled={index === socialLinks.length - 1}
                    style={[
                      styles.iconButton,
                      index === socialLinks.length - 1 && styles.iconButtonDisabled,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Move down"
                  >
                    <Feather
                      name="chevron-down"
                      size={16}
                      color={index === socialLinks.length - 1 ? '#CBD5E1' : '#64748B'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleOpenEdit(link)}
                    style={styles.iconButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${platformName} link`}
                  >
                    <Feather name="edit-2" size={14} color="#334155" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteLink(link.id)}
                    style={styles.iconButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${platformName} link`}
                  >
                    <Feather name="trash-2" size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  editorTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 10,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  editorInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  editorInputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  detectedContainer: {
    marginTop: 2,
    marginBottom: 8,
  },
  detectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 7,
  },
  detectedText: {
    fontSize: 12,
    color: '#475569',
  },
  detectedBrand: {
    fontWeight: '600',
    color: '#0F172A',
  },
  unrecognizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  unrecognizedText: {
    fontSize: 12,
    color: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 8,
  },
  editorActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderStyle: 'dashed',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  linksList: {
    gap: 8,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  linkContent: {
    flex: 1,
    justifyContent: 'center',
  },
  linkPlatformName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  linkUrl: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
});
