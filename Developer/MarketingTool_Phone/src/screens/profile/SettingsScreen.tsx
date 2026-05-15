import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore, parseAppwriteResponse } from '../../store/authStore';
import { authService, functions } from '../../services/appwrite';
import { ExecutionMethod } from 'react-native-appwrite';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';
import { biometricService } from '../../services/biometric';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, logout, setup2FA, enable2FA, disable2FA } = useAuthStore();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false); 

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    marketingEmails: true,
    biometricLogin: false,
    darkMode: true,
    autoSave: true,
    hapticFeedback: true,
  });

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaModal, setMfaModal] = useState(false);
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaOtp, setMfaOtp] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  const [passwordModal, setPasswordModal] = useState<'hidden' | 'current' | 'new'>('hidden');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const openEditName = () => {
    setNameDraft(user?.name || '');
    setNameModalVisible(true);
  };

  const handleSaveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }
    if (trimmed === user?.name) {
      setNameModalVisible(false);
      return;
    }
    try {
      setNameSaving(true);
      await authService.updateProfile(trimmed);
      await useAuthStore.getState().updateProfile({ name: trimmed });
      setNameModalVisible(false);
    } catch (err: any) {
      Alert.alert('Update failed', err?.message || 'Could not update your name.');
    } finally {
      setNameSaving(false);
    }
  };

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      const available = await biometricService.isBiometricAvailable();
      setBiometricAvailable(available);
      const enabled = await biometricService.isBiometricEnabled();
      setBiometricEnabled(enabled);
      setSettings(prev => ({ ...prev, biometricLogin: enabled }));
      
      // Check Appwrite user for MFA status
      if (user) {
        setMfaEnabled(user.mfa || false);
      }
    };
    loadState();
  }, [user]);

  const handle2FAToggle = async () => {
    if (mfaEnabled) {
      Alert.alert(
        'Disable 2FA',
        'Are you sure you want to disable two-factor authentication?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive', 
            onPress: async () => {
              try {
                await disable2FA();
                setMfaEnabled(false);
                Alert.alert('Success', '2FA has been disabled.');
              } catch (e: any) {
                Alert.alert('Error', e.message || 'Failed to disable 2FA');
              }
            } 
          }
        ]
      );
    } else {
      setMfaLoading(true);
      try {
        const result = await setup2FA();
        setMfaSecret(result.secret);
        setMfaModal(true);
      } catch (e: any) {
        const msg = (e?.message || '').toLowerCase();
        const type = (e?.type || '').toLowerCase();
        if (type.includes('password') || msg.includes('password')) {
          Alert.alert(
            'Set a Password First',
            'Two-factor authentication requires a password on your account. Set one now to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Set Password', onPress: () => {
                setCurrentPassword('');
                setNewPassword('');
                setPasswordModal('new');
              }},
            ]
          );
        } else if (msg.includes('verified') || msg.includes('verification')) {
          Alert.alert('Verify Your Email First', 'Please verify your email address before enabling two-factor authentication.');
        } else {
          Alert.alert('2FA Setup Failed', e?.message || 'Could not initiate 2FA setup. Please try again.');
        }
      } finally {
        setMfaLoading(false);
      }
    }
  };

  const handleVerifyEnable2FA = async () => {
    if (mfaOtp.length < 6) return;
    setMfaLoading(true);
    try {
      await enable2FA(mfaOtp);
      setMfaEnabled(true);
      setMfaModal(false);
      Alert.alert('Success', '2FA is now enabled on your account.');
    } catch (e: any) {
      Alert.alert('Verification Failed', 'Invalid code. Please try again.');
    } finally {
      setMfaLoading(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === 'biometricLogin') {
      handleBiometricToggle();
      return;
    }
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBiometricToggle = async () => {
    if (!biometricAvailable) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
      return;
    }
    
    const newValue = !biometricEnabled;
    try {
      if (newValue) {
        // Require authentication to enable
        const success = await biometricService.authenticate('Confirm to enable biometric login');
        if (success) {
          await biometricService.setBiometricEnabled(true);
          setBiometricEnabled(true);
          setSettings(prev => ({ ...prev, biometricLogin: true }));
        }
      } else {
        await biometricService.setBiometricEnabled(false);
        setBiometricEnabled(false);
        setSettings(prev => ({ ...prev, biometricLogin: false }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric settings');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.$id) {
                throw new Error('User session not found. Please log in again.');
              }
              const execution = await functions.createExecution(
                'delete-account',
                JSON.stringify({ userId: user.$id }),
                false, '/', ExecutionMethod.POST,
              );
              const body = parseAppwriteResponse(execution.responseBody);
              if (body.success !== true) {
                throw new Error(body.message || body.error || 'Deletion failed on server');
              }
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              logout();
            } catch (error: any) {
              Alert.alert(
                'Deletion Failed',
                error?.message || 'We could not delete your account. Please contact support@marketingtool.pro.',
              );
            }
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    try {
      const SecureStore = require('expo-secure-store');
      await SecureStore.deleteItemAsync('appwrite_session');
      Alert.alert('Cache Cleared', 'App cache has been cleared successfully.', [{ text: 'OK' }]);
    } catch (error: any) {
      Alert.alert('Clear Failed', error?.message || 'Could not clear cache. Please try again.');
    }
  };

  const handleChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setPasswordModal('current');
  };

  const handlePasswordNext = () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }
    setPasswordModal('new');
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters.');
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      setPasswordModal('hidden');
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert('Success', 'Your password has been set. You can now enable two-factor authentication.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'bell',
          label: 'Push Notifications',
          description: 'Receive push notifications',
          key: 'notifications',
          type: 'switch',
        },
        {
          icon: 'mail',
          label: 'Email Updates',
          description: 'Get product updates via email',
          key: 'emailUpdates',
          type: 'switch',
        },
        {
          icon: 'gift',
          label: 'Marketing Emails',
          description: 'Receive offers and promotions',
          key: 'marketingEmails',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: 'smartphone',
          label: 'Biometric Login',
          description: 'Use Face ID / Touch ID to login',
          key: 'biometricLogin',
          type: 'switch',
        },
        {
          icon: 'lock',
          label: 'Change Password',
          description: 'Update your password',
          type: 'action',
          action: () => {
            Alert.alert(
              'Change Password',
              `A password reset link will be sent to ${user?.email || 'your email'}.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Link', onPress: handleChangePassword },
              ]
            );
          },
        },
        {
          icon: 'key',
          label: 'Two-Factor Authentication',
          description: mfaEnabled ? 'Currently enabled' : 'Protect your account',
          type: 'action',
          action: handle2FAToggle,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          description: 'Always on',
          key: 'darkMode',
          type: 'info',
        },
        {
          icon: 'smartphone',
          label: 'Haptic Feedback',
          description: 'Vibration for interactions',
          key: 'hapticFeedback',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          icon: 'save',
          label: 'Auto-Save',
          description: 'Automatically save generations',
          key: 'autoSave',
          type: 'switch',
        },
        {
          icon: 'trash-2',
          label: 'Clear Cache',
          description: 'Free up storage space',
          type: 'action',
          action: () => {
            handleClearCache();
          },
        },
        {
          icon: 'download',
          label: 'Export Data',
          description: 'Download your data',
          type: 'action',
          action: () => {
            Alert.alert(
              'Export Data',
              'To request a copy of your data, email help@marketingtool.pro. We will respond within 30 days as required by law.',
              [
                { text: 'OK' },
                { text: 'Email Now', onPress: () => Linking.openURL('mailto:help@marketingtool.pro?subject=Data Export Request') },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'info',
          label: 'App Version',
          description: '1.5.0',
          type: 'info',
        },
        {
          icon: 'file-text',
          label: 'Terms of Service',
          type: 'action',
          action: () => (navigation as any).navigate('Terms'),
        },
        {
          icon: 'shield',
          label: 'Privacy Policy',
          type: 'action',
          action: () => (navigation as any).navigate('Privacy'),
        },
        {
          icon: 'book-open',
          label: 'Open Source Licenses',
          type: 'action',
          action: () => {
            Alert.alert(
              'Open Source Licenses',
              'This app uses the following open source libraries:\n\n• React Native (MIT)\n• Expo SDK (MIT)\n• Zustand (MIT)\n• React Navigation (MIT)\n• Appwrite SDK (BSD-3)\n• Lottie React Native (Apache 2.0)\n\nFull license details available at marketingtool.pro',
              [{ text: 'OK' }]
            );
          },
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <LinearGradient colors={[Colors.secondary, Colors.accent]} style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </LinearGradient>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={openEditName}
            accessibilityRole="button"
            accessibilityLabel="Edit profile name"
          >
            <Feather name="edit-2" size={18} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={item.type === 'action' ? item.action : undefined}
                  disabled={item.type === 'switch' || item.type === 'info'}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Feather name={item.icon as any} size={20} color={Colors.secondary} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.description && (
                        <Text style={styles.settingDescription}>{item.description}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === 'switch' && 'key' in item && (
                      <Switch
                        value={settings[item.key as keyof typeof settings]}
                        onValueChange={() => toggleSetting(item.key as keyof typeof settings)}
                        trackColor={{ false: Colors.border, true: Colors.secondary + '50' }}
                        thumbColor={settings[item.key as keyof typeof settings] ? Colors.secondary : Colors.textTertiary}
                      />
                    )}
                    {item.type === 'action' && (
                      <Feather name="chevron-right" size={20} color={Colors.textTertiary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.error }]}>Danger Zone</Text>
          <View style={styles.sectionItems}>
            <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.error + '15' }]}>
                  <Feather name="trash-2" size={20} color={Colors.error} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: Colors.error }]}>Delete Account</Text>
                  <Text style={styles.settingDescription}>Permanently delete your account and data</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 2FA Setup Modal */}
      <Modal
        visible={mfaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setMfaModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Setup 2FA</Text>
            <Text style={styles.modalSubtitle}>
              1. Install an authenticator app (Google Authenticator, Authy, etc.){"\n"}
              2. Add a new account with this secret:
            </Text>

            <View style={styles.secretBox}>
              <Text style={styles.secretText} numberOfLines={1}>{mfaSecret}</Text>
              <TouchableOpacity onPress={() => {
                const Clipboard = require('expo-clipboard');
                Clipboard.setStringAsync(mfaSecret);
                Alert.alert('Copied', 'Secret copied to clipboard.');
              }}>
                <Feather name="copy" size={18} color={Colors.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              3. Enter the 6-digit code from the app to verify:
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="000000"
              placeholderTextColor={Colors.textTertiary}
              value={mfaOtp}
              onChangeText={setMfaOtp}
              keyboardType="number-pad"
              maxLength={6}
              editable={!mfaLoading}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setMfaModal(false)}
                disabled={mfaLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, (mfaOtp.length < 6 || mfaLoading) && { opacity: 0.6 }]}
                onPress={handleVerifyEnable2FA}
                disabled={mfaOtp.length < 6 || mfaLoading}
              >
                <Text style={styles.modalSubmitText}>
                  {mfaLoading ? 'Verifying...' : 'Enable 2FA'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModal !== 'hidden'}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModal('hidden')}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {passwordModal === 'current' ? 'Change Password' : 'New Password'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {passwordModal === 'current'
                ? 'Enter your current password'
                : 'Enter your new password (min 8 characters)'}
            </Text>

            <TextInput
              style={styles.modalInput}
              secureTextEntry
              autoFocus
              placeholder={passwordModal === 'current' ? 'Current password' : 'New password'}
              placeholderTextColor={Colors.textTertiary}
              value={passwordModal === 'current' ? currentPassword : newPassword}
              onChangeText={passwordModal === 'current' ? setCurrentPassword : setNewPassword}
              editable={!passwordLoading}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPasswordModal('hidden')}
                disabled={passwordLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, passwordLoading && { opacity: 0.6 }]}
                onPress={passwordModal === 'current' ? handlePasswordNext : handlePasswordSubmit}
                disabled={passwordLoading}
              >
                <Text style={styles.modalSubmitText}>
                  {passwordLoading ? 'Updating...' : passwordModal === 'current' ? 'Next' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <Text style={styles.modalSubtitle}>This is the name shown on your profile.</Text>

            <TextInput
              style={styles.modalInput}
              autoFocus
              placeholder="Your name"
              placeholderTextColor={Colors.textTertiary}
              value={nameDraft}
              onChangeText={setNameDraft}
              editable={!nameSaving}
              maxLength={64}
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setNameModalVisible(false)}
                disabled={nameSaving}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, (nameSaving || !nameDraft.trim()) && { opacity: 0.6 }]}
                onPress={handleSaveName}
                disabled={nameSaving || !nameDraft.trim()}
              >
                <Text style={styles.modalSubmitText}>
                  {nameSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1C',
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#0D0F1C',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionItems: {
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.white,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    marginLeft: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'rgba(22, 24, 36, 0.95)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  modalInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalSubmitBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  secretBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  secretText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
});

export default SettingsScreen;
