# Sub-project A: Auth & OTP Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix OTP login so users can actually sign in. Remove onboarding splash screens. Fix crash on login.

**Architecture:** Phone OTP flows through `authStore.sendPhoneOTP` → Appwrite `msg91-proxy` function → MSG91/Bird API. The "Code required" error means the OTP code isn't reaching MSG91 correctly (phone format mismatch). Fix: normalize phone format, add validation, remove dead code paths, skip onboarding.

**Tech Stack:** React Native, Expo SDK 55, Appwrite SDK, MSG91/Bird OTP, Zustand state management

---

### Task 1: Fix OTP phone number format mismatch

**Files:**
- Modify: `src/store/authStore.ts:214-244` (sendPhoneOTP)
- Modify: `src/store/authStore.ts:247-303` (verifyPhoneOTP)

The `sendPhoneOTP` strips all non-digits to get `mobile`, so `+918690361601` becomes `918690361601`. But MSG91 Widget API expects just the mobile number without country code (e.g., `8690361601`) or with it as `+918690361601`. The identifier `918690361601` (digits with country code but no `+`) is ambiguous and likely fails.

- [ ] **Step 1: Fix sendPhoneOTP phone format**

In `src/store/authStore.ts`, replace the `sendPhoneOTP` method (starting at line 214):

```typescript
  sendPhoneOTP: async (phoneNumber: string) => {
    set({ error: null });
    try {
      // phoneNumber arrives as "+918690361601" from LoginScreen
      const cleaned = phoneNumber.replace(/\D/g, '');
      const normalizedPhone = phoneNumber.startsWith('+') ? `+${cleaned}` : `+91${cleaned}`;
      // MSG91 expects the full number WITH country code including +
      const identifier = normalizedPhone;

      if (__DEV__) console.log('[Auth] Sending OTP via MSG91:', identifier);

      const execution = await functions.createExecution(
        'msg91-proxy',
        JSON.stringify({ action: 'sendOtp', identifier }),
        false, '/', ExecutionMethod.POST,
        { 'Content-Type': 'application/json' }
      );

      const responseBody = JSON.parse(execution.responseBody || '{}');
      if (__DEV__) console.log('[Auth] MSG91 sendOtp response:', JSON.stringify(responseBody));

      if (responseBody.type !== 'success') {
        throw new Error(responseBody.message || 'Failed to send OTP');
      }

      // Store the SAME identifier used for send — must match on verify
      set({ tempPhone: identifier });
      return identifier;
    } catch (error: any) {
      if (__DEV__) console.log('[Auth] Send OTP error:', error.message);
      set({ error: error.message || 'Failed to send OTP' });
      throw error;
    }
  },
```

- [ ] **Step 2: Fix verifyPhoneOTP to use matching identifier**

In `src/store/authStore.ts`, replace the `verifyPhoneOTP` method (starting at line 247):

```typescript
  verifyPhoneOTP: async (userId: string, code: string) => {
    set({ error: null });
    try {
      // Use the SAME identifier that was used for sendOtp
      const phone = get().tempPhone || userId;

      if (!code || code.length < 6) {
        throw new Error('Please enter the 6-digit OTP code');
      }

      if (__DEV__) console.log('[Auth] Verifying OTP for:', phone, 'code:', code);

      // Step 1: Verify OTP via MSG91
      const verifyExec = await functions.createExecution(
        'msg91-proxy',
        JSON.stringify({ action: 'verifyOtp', identifier: phone, otp: code }),
        false, '/', ExecutionMethod.POST,
        { 'Content-Type': 'application/json' }
      );

      const verifyResult = JSON.parse(verifyExec.responseBody || '{}');
      if (__DEV__) console.log('[Auth] MSG91 verifyOtp response:', JSON.stringify(verifyResult));

      if (!verifyResult.success) {
        throw new Error(verifyResult.message || 'Invalid OTP');
      }

      if (__DEV__) console.log('[Auth] OTP verified, creating Appwrite session...');

      // Step 2: Create Appwrite session
      const phoneDigits = phone.replace(/\D/g, '');
      const execution = await functions.createExecution(
        'phone-session',
        JSON.stringify({
          firebaseUid: 'wa_' + phoneDigits,
          phone: phone,
          displayName: '',
        }),
        false, '/', ExecutionMethod.POST,
        { 'Content-Type': 'application/json' }
      );

      const responseBody = JSON.parse(execution.responseBody || '{}');
      if (__DEV__) console.log('[Auth] phone-session response:', JSON.stringify(responseBody));

      if (!responseBody.success || !responseBody.userId || !responseBody.secret) {
        throw new Error(responseBody.error || 'Failed to create session');
      }

      // Step 3: Create Appwrite session with the token
      try { await account.deleteSession('current'); } catch (_e) {}
      const session = await account.createSession(responseBody.userId, responseBody.secret);

      if (__DEV__) console.log('[Auth] Appwrite session created:', session.$id);

      const user = await authService.getCurrentUser();
      if (user) {
        const profile = await get().fetchOrCreateProfile(user);
        set({ user, profile, isAuthenticated: true, isLoading: false, tempPhone: null });
      } else {
        throw new Error('Session created but could not fetch user');
      }
    } catch (error: any) {
      if (__DEV__) console.log('[Auth] Verify OTP error:', error.message);
      set({ error: error.message || 'Invalid OTP' });
      throw error;
    }
  },
```

- [ ] **Step 3: Commit**

```bash
git add src/store/authStore.ts
git commit -m "fix: normalize OTP phone format — use +countrycode+number consistently"
```

---

### Task 2: Fix OTP validation in LoginScreen

**Files:**
- Modify: `src/screens/auth/LoginScreen.tsx:215-227` (handleVerifyOTP)
- Modify: `src/screens/auth/LoginScreen.tsx:180-211` (handleSendOTP)

- [ ] **Step 1: Add OTP code validation before calling verify**

In `src/screens/auth/LoginScreen.tsx`, replace `handleVerifyOTP` (line 215):

```typescript
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError('Please enter the 6-digit code');
      return;
    }
    setOtpError('');
    setOtpVerifying(true);
    try {
      await verifyPhoneOTP(otpUserId, otpCode.trim());
      await SecureStore.deleteItemAsync('pendingOTP');
      setShowOtpModal(false);
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Please check and try again.');
    } finally {
      setOtpVerifying(false);
    }
  };
```

- [ ] **Step 2: Add try-catch around send OTP to show specific errors**

In `src/screens/auth/LoginScreen.tsx`, replace the catch in `handleSendOTP` (line 206):

```typescript
    } catch (err: any) {
      setOtpSending(false);
      await SecureStore.deleteItemAsync('pendingOTP');
      const msg = err.message || 'Failed to send OTP';
      setOtpError(msg);
      if (__DEV__) console.log('[LoginScreen] Send OTP failed:', msg);
    }
```

Also change line 209 from `Alert.alert(...)` to `setOtpError(msg)` — inline error instead of disruptive alert.

- [ ] **Step 3: Commit**

```bash
git add src/screens/auth/LoginScreen.tsx
git commit -m "fix: validate OTP code before verify, show inline errors instead of alerts"
```

---

### Task 3: Remove onboarding — direct to login

**Files:**
- Modify: `src/navigation/AppNavigator.tsx:156-218`

- [ ] **Step 1: Skip onboarding check and screen**

In `src/navigation/AppNavigator.tsx`, replace the `AppNavigator` component (line 156):

```typescript
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="ToolDetail"
              component={ToolDetailScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="ToolResult" component={ToolResultScreen} />
            <Stack.Screen
              name="MemeGenerator"
              component={MemeGeneratorScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

- [ ] **Step 2: Remove unused onboarding imports and state**

In `src/navigation/AppNavigator.tsx`:
- Remove line 8: `import * as SecureStore from 'expo-secure-store';`
- Remove line 11: `import OnboardingScreen from '../screens/auth/OnboardingScreen';`
- Remove line 36: `Splash: undefined;` and `Onboarding: undefined;` from RootStackParamList

- [ ] **Step 3: Commit**

```bash
git add src/navigation/AppNavigator.tsx
git commit -m "fix: remove onboarding — direct to login screen on app launch"
```

---

### Task 4: Fix crash on login — add error boundaries

**Files:**
- Modify: `src/store/authStore.ts:65-95` (login method)
- Modify: `src/store/authStore.ts:55-63` (initial state)

- [ ] **Step 1: Add null safety to login and checkAuth**

In `src/store/authStore.ts`, ensure the `checkAuth` method has proper error handling. Find `checkAuth` and wrap the entire body:

```typescript
  checkAuth: async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        try {
          const profile = await get().fetchOrCreateProfile(user);
          set({ user, profile, isAuthenticated: true, isLoading: false });
        } catch (profileErr) {
          if (__DEV__) console.warn('[Auth] Profile fetch failed, user still authenticated:', profileErr);
          set({ user, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error: any) {
      if (__DEV__) console.log('[Auth] checkAuth error:', error.message);
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },
```

- [ ] **Step 2: Add error boundary around session creation in verifyPhoneOTP**

Already handled in Task 1 with the try-catch around `account.deleteSession('current')`.

- [ ] **Step 3: Commit**

```bash
git add src/store/authStore.ts
git commit -m "fix: add null safety to checkAuth — prevent crash on profile fetch failure"
```

---

### Task 5: Clean up unused firebaseAuth import in appwrite.ts

**Files:**
- Modify: `src/services/appwrite.ts:6`

- [ ] **Step 1: Remove unused import**

The authStore uses Appwrite `msg91-proxy` directly — NOT the `firebaseAuth.ts` functions. Remove the dead import.

In `src/services/appwrite.ts`, remove line 6:

```typescript
// DELETE THIS LINE:
import { sendPhoneOTP, verifyPhoneOTP } from './firebaseAuth';
```

- [ ] **Step 2: Verify no other files import from firebaseAuth for OTP**

```bash
grep -r "from.*firebaseAuth" src/ --include="*.ts" --include="*.tsx"
```

If only `appwrite.ts` imports it, the import removal is safe. The `firebaseAuth.ts` file can stay as a backup but is not used in the active OTP flow.

- [ ] **Step 3: Commit**

```bash
git add src/services/appwrite.ts
git commit -m "chore: remove unused firebaseAuth import — OTP uses Appwrite msg91-proxy"
```
