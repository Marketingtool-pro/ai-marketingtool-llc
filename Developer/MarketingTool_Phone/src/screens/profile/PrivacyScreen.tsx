import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';


const PrivacyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screenContainer}>
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: March 1, 2026</Text>

          <Text style={styles.paragraph}>
            AI MarketingTool LLC ("we," "our," or "us") operates the MarketingTool mobile application. This Privacy Policy explains how we collect, use, and protect your personal information.
          </Text>

          <Text style={styles.heading}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            {'\u2022'} Account information (name, email, phone number){'\n'}
            {'\u2022'} Profile data (avatar, preferences, settings){'\n'}
            {'\u2022'} Usage data (tools used, generations created, features accessed){'\n'}
            {'\u2022'} Device information (device type, OS version, app version){'\n'}
            {'\u2022'} Subscription information (processed securely by Apple App Store / Google Play in-app purchase)
          </Text>

          <Text style={styles.heading}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            {'\u2022'} To provide, maintain, and improve the App and its features.{'\n'}
            {'\u2022'} To process your transactions and manage your subscriptions.{'\n'}
            {'\u2022'} To authenticate your identity and secure your account.{'\n'}
            {'\u2022'} To send you notifications about your account, updates, and service changes.{'\n'}
            {'\u2022'} To generate AI-powered marketing content based on your inputs.{'\n'}
            {'\u2022'} To improve our AI models and develop new features.
          </Text>

          <Text style={styles.heading}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We use trusted service providers to operate the App. Data shared with each provider is limited to what is necessary for the described function:{'\n\n'}
            {'\u2022'} Cloud infrastructure: Secure storage for your account data, profiles, and generation history.{'\n'}
            {'\u2022'} App stores: Subscription billing and app distribution via Apple App Store and Google Play.{'\n'}
            {'\u2022'} Authentication: Secure sign-in via your Apple, Google, or Facebook account (OAuth).{'\n'}
            {'\u2022'} SMS verification: One-time codes sent to verify your phone number.{'\n'}
            {'\u2022'} Push notifications: Delivered through your device's native notification service.{'\n'}
            {'\u2022'} AI content generation: Your inputs are processed to generate marketing content. Inputs are not stored by AI providers after processing.
          </Text>

          <Text style={styles.heading}>Biometric Data</Text>
          <Text style={styles.paragraph}>
            If you choose to enable Biometric Login (Face ID or Touch ID), please be aware that MarketingTool does not collect, store, or transmit your biometric data. Authentication is handled entirely and securely on your device using the native operating system's keychain.
          </Text>

          <Text style={styles.heading}>Data Security</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal data to any third party. Data shared with third-party services is limited to what is necessary to provide the App's functionality. We implement appropriate security measures to protect your data, including encryption in transit and at rest.
          </Text>

          <Text style={styles.heading}>Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us or using the Delete Account option in Settings.
          </Text>

          <Text style={styles.heading}>Your Rights</Text>
          <Text style={styles.paragraph}>
            {'\u2022'} Access and export your personal data{'\n'}
            {'\u2022'} Request correction of inaccurate data{'\n'}
            {'\u2022'} Request deletion of your account and data{'\n'}
            {'\u2022'} Opt out of marketing communications{'\n'}
            {'\u2022'} Withdraw consent at any time
          </Text>

          <Text style={styles.heading}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            MarketingTool is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
          </Text>

          <Text style={styles.heading}>Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>

          <Text style={styles.heading}>Contact Information</Text>
          <Text style={styles.paragraph}>
            For any questions or concerns regarding this Privacy Policy, please contact us at: help@marketingtool.pro or visit https://marketingtool.pro/privacy-policy/
          </Text>

          <Text style={styles.companyInfo}>
            AI MarketingTool LLC{'\n'}
            30 N Gould St, STE R{'\n'}
            Sheridan, WY 82801, USA
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerCompany}>AI MarketingTool LLC</Text>
          <Text style={styles.footerEmail}>help@marketingtool.pro</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0D0F1C',
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
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
    backgroundColor: Colors.surface,
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: Spacing.lg,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  companyInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: Spacing.lg,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  footerCompany: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  footerEmail: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 4,
  },
});

export default PrivacyScreen;
