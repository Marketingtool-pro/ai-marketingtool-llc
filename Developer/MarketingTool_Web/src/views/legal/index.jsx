import { useLocation } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// @project
import branding from '@/branding.json';

const COMPANY = 'Ai marketingtool LLC';
const ADDRESS = '30 N Gould St, STE R, Sheridan, WY 82801, USA';
const EMAIL = 'help@marketingtool.pro';
const WEBSITE = 'https://marketingtool.pro';
const APP = 'https://app.marketingtool.pro';
const EFFECTIVE = 'January 1, 2026';
const UPDATED = 'March 6, 2026';

const sectionSx = { mb: 4 };
const h2Sx = { mb: 1.5, fontWeight: 600 };
const h3Sx = { mb: 1, fontWeight: 600, mt: 2 };
const pSx = { mb: 1.5, color: 'text.secondary', lineHeight: 1.7 };
const liSx = { color: 'text.secondary', lineHeight: 1.7, mb: 0.5 };

function Header({ title }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Effective:</strong> {EFFECTIVE} | <strong>Last Updated:</strong> {UPDATED}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Company:</strong> {COMPANY}, {ADDRESS}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Contact:</strong> <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link>
      </Typography>
    </Box>
  );
}

function PolicyLinks() {
  const links = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Trust & Verification', href: '/trust-verification' },
    { label: 'Delete Account', href: '/delete-account' },
  ];
  return (
    <Box sx={sectionSx}>
      <Typography variant="h6" sx={h2Sx}>All Policies</Typography>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} underline="hover" variant="body2">{l.label}</Link>
        ))}
      </Stack>
    </Box>
  );
}

/* ==================== PRIVACY POLICY ==================== */
function PrivacyPolicy() {
  return (
    <>
      <Header title="Privacy Policy" />

      <Box sx={sectionSx}>
        <Typography sx={pSx}>
          {COMPANY} ("we", "us", "our") operates the MarketingTool.pro platform, a SaaS application providing AI-powered marketing tools for Google Ads, Meta (Facebook/Instagram) Ads, SEO, content writing, and e-commerce marketing. This Privacy Policy describes how we collect, use, store, share, and protect your personal information and advertising account data.
        </Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>1. Information We Collect</Typography>
        <Typography variant="subtitle2" sx={h3Sx}>1.1 Account Information</Typography>
        <ul><li><Typography sx={liSx}>Name, email address, and password when you create an account.</Typography></li>
        <li><Typography sx={liSx}>Profile information including company name and job title (optional).</Typography></li>
        <li><Typography sx={liSx}>Authentication tokens when you sign in via Google OAuth or Facebook Login.</Typography></li></ul>

        <Typography variant="subtitle2" sx={h3Sx}>1.2 Payment Information</Typography>
        <ul><li><Typography sx={liSx}>Billing details processed through Stripe. We do not store full credit card numbers on our servers.</Typography></li>
        <li><Typography sx={liSx}>Subscription plan, billing cycle, and transaction history.</Typography></li></ul>

        <Typography variant="subtitle2" sx={h3Sx}>1.3 Google Ads Data</Typography>
        <Typography sx={pSx}>When you connect your Google Ads account via OAuth 2.0, we access campaign data, ad group data, keyword data, ad copy data, account structure, and audience data through the Google Ads API.</Typography>
        <Typography sx={pSx}><strong>Purpose:</strong> We use Google Ads data solely to provide our AI-powered optimization tools, generate performance reports, provide campaign recommendations, and help you manage your advertising. We do NOT use Google Ads data to build user profiles for advertising by third parties, sell or share this data with advertisers or ad networks, or for any purpose unrelated to the services you request.</Typography>

        <Typography variant="subtitle2" sx={h3Sx}>1.4 Meta (Facebook/Instagram) Ads Data</Typography>
        <Typography sx={pSx}>When you connect your Meta Business account, we access ad account data, campaign data, ad set data, ad creative data, pixel/conversion data, page data, and Instagram data through the Marketing API. We comply with Meta Platform Terms and Developer Policies.</Typography>

        <Typography variant="subtitle2" sx={h3Sx}>1.5 Usage & Device Data</Typography>
        <ul><li><Typography sx={liSx}>Tool usage history, generated content, session data, feature interactions.</Typography></li>
        <li><Typography sx={liSx}>Browser type, IP address, device type, operating system, referring URLs.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>2. How We Use Your Information</Typography>
        <ul><li><Typography sx={liSx}><strong>Service Delivery:</strong> Provide, operate, and maintain our AI marketing tools.</Typography></li>
        <li><Typography sx={liSx}><strong>Ads Management:</strong> Connect to and manage your Google Ads and Meta advertising campaigns.</Typography></li>
        <li><Typography sx={liSx}><strong>AI Generation:</strong> Power content creation, campaign optimization, and analytics tools.</Typography></li>
        <li><Typography sx={liSx}><strong>Analytics:</strong> Understand platform usage to improve features (self-hosted Matomo).</Typography></li>
        <li><Typography sx={liSx}><strong>Billing:</strong> Process payments and manage subscriptions via Stripe.</Typography></li>
        <li><Typography sx={liSx}><strong>Security:</strong> Detect and prevent unauthorized access and abuse.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>3. Google Ads API — Limited Use Disclosure</Typography>
        <Typography sx={pSx}>MarketingTool.pro's use and transfer to any other app of information received from Google APIs will adhere to the <Link href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</Link>, including the Limited Use requirements.</Typography>
        <ul><li><Typography sx={liSx}>We only access Google Ads data necessary to provide our marketing tools.</Typography></li>
        <li><Typography sx={liSx}>We do not sell Google Ads data or use it for advertising purposes.</Typography></li>
        <li><Typography sx={liSx}>We do not use Google Ads data to build profiles for ad targeting by any party.</Typography></li>
        <li><Typography sx={liSx}>Users can revoke access at any time via Google Account settings or our platform.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>4. Data Sharing</Typography>
        <ul><li><Typography sx={liSx}><strong>Stripe:</strong> Payment processing (PCI DSS Level 1 compliant).</Typography></li>
        <li><Typography sx={liSx}><strong>Anthropic (Claude):</strong> AI content generation (no personal data sent — only prompts).</Typography></li>
        <li><Typography sx={liSx}><strong>Matomo:</strong> Self-hosted analytics — no data shared with third parties.</Typography></li></ul>
        <Typography sx={pSx}>We do NOT sell your personal data to anyone. We do NOT share Google Ads or Meta data with advertisers or ad networks.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>5. Security Measures</Typography>
        <ul><li><Typography sx={liSx}>TLS 1.2+ encryption for all data in transit.</Typography></li>
        <li><Typography sx={liSx}>AES-256 encryption for data at rest.</Typography></li>
        <li><Typography sx={liSx}>Row-Level Security (RLS) on all database tables.</Typography></li>
        <li><Typography sx={liSx}>OAuth 2.0 for third-party authentication; JWT-based session management.</Typography></li>
        <li><Typography sx={liSx}>Passwords hashed with bcrypt — never stored in plain text.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>6. Data Retention & Deletion</Typography>
        <ul><li><Typography sx={liSx}>Account data retained while your account is active.</Typography></li>
        <li><Typography sx={liSx}>Upon account deletion, all personal data is permanently removed within 30 days.</Typography></li>
        <li><Typography sx={liSx}>Ad account tokens are revoked immediately upon disconnection.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>7. Your Rights</Typography>
        <ul><li><Typography sx={liSx}><strong>Access:</strong> Request a copy of all data we hold about you.</Typography></li>
        <li><Typography sx={liSx}><strong>Correction:</strong> Update or correct inaccurate data.</Typography></li>
        <li><Typography sx={liSx}><strong>Deletion:</strong> Request permanent deletion of your account and data.</Typography></li>
        <li><Typography sx={liSx}><strong>Export:</strong> Download your chat history and generated content.</Typography></li>
        <li><Typography sx={liSx}><strong>Revoke:</strong> Disconnect Google Ads or Meta accounts at any time.</Typography></li></ul>
        <Typography sx={pSx}>For any privacy requests, email <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link>.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>8. International Data Transfers</Typography>
        <Typography sx={pSx}>Our servers are located in the United States. If you access our services from outside the United States, your data may be transferred to and processed in the United States. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable data protection laws.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>9. Children's Privacy</Typography>
        <Typography sx={pSx}>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 18, we will delete it promptly.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>10. Contact</Typography>
        <Typography sx={pSx}>{COMPANY}<br />{ADDRESS}<br />Email: <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link><br />Website: <Link href={WEBSITE} target="_blank">{WEBSITE}</Link></Typography>
      </Box>

      <PolicyLinks />
    </>
  );
}

/* ==================== TERMS & CONDITIONS ==================== */
function TermsPolicy() {
  return (
    <>
      <Header title="Terms & Conditions" />

      <Box sx={sectionSx}>
        <Typography sx={pSx}>By accessing or using MarketingTool.pro ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree, do not use the Service.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>1. Description of Services</Typography>
        <Typography sx={pSx}>MarketingTool.pro is a SaaS platform providing AI-powered marketing tools, including Google Ads management and optimization, Meta (Facebook/Instagram) Ads management, SEO and content writing tools, e-commerce and Shopify tools, campaign building and analytics, and AI-powered content generation.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>2. Account Registration</Typography>
        <ul><li><Typography sx={liSx}>You must be 18 years or older to use our platform.</Typography></li>
        <li><Typography sx={liSx}>You are responsible for maintaining the confidentiality of your credentials.</Typography></li>
        <li><Typography sx={liSx}>One account per person or entity.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>3. Subscription Plans & Billing</Typography>
        <Typography sx={pSx}>Plans: Starter, Professional, Growth, and Agency (custom). Extra tokens available at $3 per 100 generations. All payments processed by Stripe. We do not store your card data.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>4. Google Ads API Usage</Typography>
        <Typography sx={pSx}>When you connect your Google Ads account, you grant us permission to access your advertising data through the Google Ads API. We use this data solely to provide optimization tools, analytics, and campaign management features. You may revoke access at any time.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>5. Meta API Usage</Typography>
        <Typography sx={pSx}>When you connect your Meta Business account, you grant us permission to access your ad account data through the Meta Marketing API. We comply with Meta Platform Terms and Developer Policies.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>6. AI-Generated Content</Typography>
        <ul><li><Typography sx={liSx}>You own all AI-generated content created through our tools.</Typography></li>
        <li><Typography sx={liSx}>You are responsible for reviewing and using content appropriately.</Typography></li>
        <li><Typography sx={liSx}>We make no guarantees about the accuracy of AI-generated content.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>7. Acceptable Use</Typography>
        <Typography sx={pSx}>You agree not to use the Service for illegal activities, hacking, spamming, or any activity that violates Google Ads, Meta, or any other platform's policies. We reserve the right to terminate accounts that violate these terms.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>8. Refund Policy</Typography>
        <ul><li><Typography sx={liSx}><strong>Monthly:</strong> No partial-month refunds. Cancel anytime; access continues until end of billing period.</Typography></li>
        <li><Typography sx={liSx}><strong>Annual:</strong> Pro-rated refund within 30 days if fewer than 50 generations used.</Typography></li>
        <li><Typography sx={liSx}><strong>Tokens:</strong> Non-refundable once purchased.</Typography></li></ul>
        <Typography sx={pSx}>Email <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> for refund requests.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>9. Limitation of Liability</Typography>
        <Typography sx={pSx}>Our liability is capped at the amount you paid in the preceding 12 months. The Service is provided "as is" without warranties. We target 99.9% uptime but do not guarantee uninterrupted service.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>10. Governing Law</Typography>
        <Typography sx={pSx}>These terms are governed by the laws of the State of Wyoming, USA. Disputes shall be resolved through binding arbitration in Sheridan County, Wyoming.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>11. Contact</Typography>
        <Typography sx={pSx}>{COMPANY}<br />{ADDRESS}<br />Email: <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link></Typography>
      </Box>

      <PolicyLinks />
    </>
  );
}

/* ==================== COOKIE POLICY ==================== */
function CookiePolicy() {
  return (
    <>
      <Header title="Cookie Policy" />

      <Box sx={sectionSx}>
        <Typography sx={pSx}>This Cookie Policy explains how {COMPANY} uses cookies and similar technologies on MarketingTool.pro.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>1. Essential Cookies</Typography>
        <Typography sx={pSx}>Required for the platform to function: session management, authentication tokens, CSRF protection. These cannot be disabled.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>2. Analytics Cookies</Typography>
        <Typography sx={pSx}>We use self-hosted Matomo analytics to understand usage patterns. No data is shared with third parties. You can opt out via the Ketch consent banner.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>3. No Advertising Cookies</Typography>
        <Typography sx={pSx}>We do not use Google Analytics, Facebook Pixel, or any third-party advertising cookies. We do not embed third-party tracking scripts, social media widgets, or remarketing pixels on our platform.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>4. Managing Cookies</Typography>
        <Typography sx={pSx}>You can manage cookie preferences through the consent banner or your browser settings. Note that disabling essential cookies may prevent the platform from functioning correctly.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>5. Contact</Typography>
        <Typography sx={pSx}>Questions about our cookie practices? Email <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link>.</Typography>
      </Box>

      <PolicyLinks />
    </>
  );
}

/* ==================== TRUST & VERIFICATION ==================== */
function TrustVerification() {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>Trust & Verification</Typography>
        <Typography variant="body2" color="text.secondary">
          Transparency, security, and compliance — everything you need to know about doing business with us.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Last Updated:</strong> {UPDATED}
        </Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>Company Verification</Typography>
        <Table size="small" sx={{ mb: 2, '& td, & th': { border: 0, py: 0.8 } }}>
          <TableBody>
            <TableRow><TableCell><strong>Company Name</strong></TableCell><TableCell>Ai marketingtool LLC</TableCell></TableRow>
            <TableRow><TableCell><strong>Type</strong></TableCell><TableCell>Limited Liability Company</TableCell></TableRow>
            <TableRow><TableCell><strong>State</strong></TableCell><TableCell>Wyoming, USA</TableCell></TableRow>
            <TableRow><TableCell><strong>Filed</strong></TableCell><TableCell>January 23, 2026</TableCell></TableRow>
            <TableRow><TableCell><strong>Filing ID</strong></TableCell><TableCell>2026-001874488</TableCell></TableRow>
            <TableRow><TableCell><strong>EIN</strong></TableCell><TableCell>32-0841304</TableCell></TableRow>
            <TableRow><TableCell><strong>Sole Member</strong></TableCell><TableCell>Lokendra Singh Saingar</TableCell></TableRow>
            <TableRow><TableCell><strong>Address</strong></TableCell><TableCell>{ADDRESS}</TableCell></TableRow>
            <TableRow><TableCell><strong>Registered Agent</strong></TableCell><TableCell>Registered Agents Inc, 30 N Gould St Ste R, Sheridan, WY 82801</TableCell></TableRow>
          </TableBody>
        </Table>
        <Typography sx={pSx}>
          Verify: Search "Ai marketingtool LLC" on the{' '}
          <Link href="https://wyobiz.wyo.gov/Business/FilingSearch.aspx" target="_blank" rel="noopener">Wyoming Secretary of State</Link> website (Filing ID: 2026-001874488).
        </Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>Payment Security</Typography>
        <Typography sx={{ ...pSx, fontWeight: 600 }}>We do NOT store your payment card data on our servers.</Typography>
        <ul><li><Typography sx={liSx}>All transactions processed by Stripe (PCI DSS Level 1 certified).</Typography></li>
        <li><Typography sx={liSx}>TLS 1.2+ encryption for all data in transit.</Typography></li>
        <li><Typography sx={liSx}>Tokenized payments — card details never touch our servers.</Typography></li>
        <li><Typography sx={liSx}>3D Secure authentication for supported cards.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>Security & Infrastructure</Typography>
        <ul><li><Typography sx={liSx}>OAuth 2.0 for Google and Meta account connections.</Typography></li>
        <li><Typography sx={liSx}>JWT-based session management with automatic token expiry.</Typography></li>
        <li><Typography sx={liSx}>Passwords hashed with bcrypt.</Typography></li>
        <li><Typography sx={liSx}>Row-Level Security (RLS) on all database tables.</Typography></li>
        <li><Typography sx={liSx}>HTTPS enforced on all endpoints (HSTS enabled).</Typography></li>
        <li><Typography sx={liSx}>Self-hosted analytics (Matomo) — no third-party trackers.</Typography></li>
        <li><Typography sx={liSx}>Daily automated backups with point-in-time recovery.</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>CCPA Notice (California Residents)</Typography>
        <Typography sx={pSx}>We do NOT sell personal information. Submit requests to <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> with subject "CCPA Request."</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>Contact</Typography>
        <Typography sx={pSx}>{COMPANY}<br />{ADDRESS}<br />Email: <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link><br />Website: <Link href={WEBSITE} target="_blank">{WEBSITE}</Link> | App: <Link href={APP} target="_blank">{APP}</Link></Typography>
      </Box>

      <PolicyLinks />
    </>
  );
}

/* ==================== DELETE ACCOUNT ==================== */
function DeleteAccount() {
  return (
    <>
      <Header title="Delete Account" />

      <Box sx={sectionSx}>
        <Typography sx={pSx}>You have the right to permanently delete your account and all associated data at any time.</Typography>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>What Happens When You Delete</Typography>
        <ul><li><Typography sx={liSx}>Your account is immediately deactivated.</Typography></li>
        <li><Typography sx={liSx}>All personal data is permanently deleted within 30 days.</Typography></li>
        <li><Typography sx={liSx}>Connected ad account tokens (Google Ads, Meta) are revoked immediately.</Typography></li>
        <li><Typography sx={liSx}>AI-generated content, chat history, and campaign data are erased.</Typography></li>
        <li><Typography sx={liSx}>Active subscriptions are cancelled (no refund for current period).</Typography></li></ul>
      </Box>

      <Box sx={sectionSx}>
        <Typography variant="h6" sx={h2Sx}>How to Delete</Typography>
        <ul><li><Typography sx={liSx}><strong>In-App:</strong> Go to Settings → Profile → Delete Account.</Typography></li>
        <li><Typography sx={liSx}><strong>By Email:</strong> Send a request to <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> from your registered email address.</Typography></li></ul>
        <Typography sx={pSx}>This action is irreversible. Please export any data you wish to keep before deleting.</Typography>
      </Box>

      <PolicyLinks />
    </>
  );
}

/* ==================== MAIN COMPONENT ==================== */

const PAGES = {
  'privacy-policy': PrivacyPolicy,
  'terms-policy': TermsPolicy,
  'cookie-policy': CookiePolicy,
  'trust-verification': TrustVerification,
  'delete-account': DeleteAccount,
};

export default function LegalPage() {
  const location = useLocation();
  const page = location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const Component = PAGES[page];

  if (!Component) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4">Page not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6, minHeight: '100vh' }}>
      <Component />
      <Divider sx={{ my: 4 }} />
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
        © 2026 {branding.brandName} — {COMPANY}, {ADDRESS}
      </Typography>
    </Container>
  );
}
