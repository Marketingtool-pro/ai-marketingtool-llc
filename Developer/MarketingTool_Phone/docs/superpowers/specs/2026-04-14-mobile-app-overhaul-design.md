# MarketingTool Pro Mobile App — Full Overhaul Spec

**Date:** 2026-04-14
**Goal:** Fix every issue blocking sales. Zero sales in 5 months — this overhaul makes the app production-quality.
**Platform:** React Native / Expo SDK 55
**Codebase:** `/Users/loken/Developer/AiMarketingtool-pro-fbaf2fad/`

---

## Sub-project A: Auth & OTP

**Problem:** OTP login shows "Code required" error. Users can't log in. Splash screens delay entry.

**Fix:**
1. Debug OTP flow: `authStore.ts:214-303` — trace MSG91 `sendOtp`/`verifyOtp` via Appwrite `msg91-proxy` function. Fix the "Code required" error (likely OTP input value not reaching `handleVerifyOTP` or `verifyPhoneOTP` rejecting valid codes).
2. Verify Appwrite cloud function `msg91-proxy` is deployed and responding. Test with real phone number.
3. Fix crash-on-login — check error boundaries in `LoginScreen.tsx`, null checks on session creation (`authStore.ts:286-288`).
4. Remove splash/onboarding screens — in `AppNavigator.tsx`, skip onboarding check, go directly to Auth or Main tab based on auth state.
5. Ensure Google/Apple/Facebook OAuth still works after changes.

**Files:**
- `src/store/authStore.ts` (sendPhoneOTP, verifyPhoneOTP)
- `src/screens/auth/LoginScreen.tsx` (handleSendOTP, handleVerifyOTP, OTP modal)
- `src/navigation/AppNavigator.tsx` (onboarding skip)
- `src/services/appwrite.ts` (functions client)

---

## Sub-project B: Icons & Assets

**Problem:** 594 existing WebP icons are similar-looking, many duplicates. Tools page looks generic. 484 new PNG icons available.

**Fix:**
1. Extract and catalog 484 PNG icons from `/Users/loken/Pictures/New Folder/` (17 icon pack folders: AI, cyberpunk, ecommerce, SEO, marketing, social media, etc.)
2. Compress all PNGs using sharp — target 64x64 or 128x128 WebP at quality 80.
3. Map compressed icons to 314 tools by category: AI tools get AI icons, SEO tools get SEO icons, Meta tools get social media icons, etc.
4. Update `src/constants/toolIcons.ts` with new mappings.
5. Remove old `src/assets/images/tool-icons-v2/` (594 files) and `tool-icons/` (94 files).
6. Verify no broken icon references in ToolsScreen.

**Source:** `/Users/loken/Pictures/New Folder/` (484 PNG files across 17 packs)
**Target:** `src/assets/images/tool-icons/` (compressed WebP, one per tool)

---

## Sub-project C: Tools & Pro Lock

**Problem:** PRO tools don't have proper lock enforcement. Tools show "0 uses". Tool execution not connected to real backend.

**Fix:**
1. PRO lock: In `ToolsScreen.tsx`, when user taps a PRO tool without subscription, show subscription prompt instead of opening tool. Current code only shows a small gold lock icon — needs blocking modal.
2. Tool execution: Connect tool runner to Windmill backend (VPS 1). Each tool's `slug` maps to a Windmill flow/script. NOT the web app's API.
3. Real AI results: Genkit AI integration via Appwrite function or direct API. Social media tools return real data with governance policy compliance.
4. Tool result display: Follow mobile guidelines — show preview on mobile, "View full on desktop" option for long results.

**Files:**
- `src/screens/tools/ToolsScreen.tsx` (PRO lock logic)
- `src/screens/tools/ToolDetailScreen.tsx` (tool execution)
- `src/store/toolsStore.ts` (tool runner, Windmill connection)
- `src/services/appwrite.ts` (Windmill proxy functions)

---

## Sub-project D: History & Payments

**Problem:** History page shows "No History Yet" always. Payment links don't work. Zero revenue.

**Fix:**
1. History: Wire `HistoryScreen.tsx` to Appwrite `generations` collection. Fetch user's generations, display with category filters (Ads, Content, Email, Social, E-commerce). Support save/like/delete.
2. Payments: Integrate `react-native-iap` for iOS subscriptions (already in dependencies). Map subscription tiers: free/starter/pro/alltools/enterprise/agency.
3. Payment links: All subscription buttons navigate to iOS IAP purchase flow. Verify receipt with Appwrite backend.
4. Credit system: Track usage in `credit_usage` collection. Show remaining credits in UI.

**Files:**
- `src/screens/main/HistoryScreen.tsx`
- `src/store/toolsStore.ts` (generations CRUD)
- `src/screens/subscription/SubscriptionScreen.tsx`
- `src/services/appwrite.ts` (collections: generations, subscriptions, credit_usage)

---

## Sub-project E: Backend Integration

**Problem:** Mobile app functions are incomplete. Need full Appwrite integration, Firebase App Check, Genkit AI.

**Fix:**
1. Appwrite collections: Ensure all collections exist and are accessible — users, tools, generations, subscriptions, credit_usage, chat_sessions, chat_messages, favorites.
2. Firebase App Check: Enable in `app.config.js` and `firebaseAuth.ts`. Verify tokens on Appwrite backend.
3. Bird OTP extension: MSG91 via Bird — verify `msg91-proxy` Appwrite function handles both send and verify correctly.
4. Genkit AI: Connect AI chat and tool execution to Genkit AI via Appwrite functions or AI Router on VPS 1.
5. Tool executor: Each tool maps to a Windmill flow on VPS 1. Appwrite function proxies requests.

**Infrastructure:**
- VPS 1: Appwrite + Windmill + AI Router + Django + NPM
- VPS 2: Web app dist/ + Supabase
- Mobile app connects ONLY to VPS 1 (Appwrite endpoint: `https://api.marketingtool.pro/v1`)

---

## Sub-project F: UI Polish

**Problem:** Profile image broken, help center empty, wrong links, no governance compliance markers.

**Fix:**
1. Profile hero image: Fix image source in ProfileScreen. Use Appwrite storage for user avatars.
2. Help center: Add real content — FAQ, contact, tutorials. Not placeholder text.
3. Website links: Audit ALL links in the app. Every link must point to `marketingtool.pro` — NO localhost, NO broken URLs.
4. Governance policy: Social media tools show compliance notice. AI-generated content labeled appropriately.
5. Home page: Verify dashboard stats, quick actions, and featured tools all work with real data.

**Files:**
- `src/screens/main/ProfileScreen.tsx`
- `src/screens/main/DashboardScreen.tsx`
- Help center screen (create if doesn't exist)
- Global link audit across all screens

---

## Execution Order

```
A (Auth) → B (Icons) → C (Tools) → D (History/Payments) → E (Backend) → F (UI Polish)
```

Each sub-project gets its own implementation plan and build/test cycle. A must complete first since it unblocks user access. B and C make the product usable. D drives revenue. E powers everything. F polishes for App Store quality.
