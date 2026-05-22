import { useState, useCallback, useRef } from 'react';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// @assets
import {
  IconSearch,
  IconBookmark,
  IconBookmarkFilled,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandInstagram,
  IconSparkles,
  IconX,
  IconCopy,
  IconExternalLink,
  IconArrowRight,
  IconFilter,
  IconLayoutGrid,
  IconLayoutList,
  IconTrendingUp,
  IconEye,
  IconHeart,
  IconShare,
  IconDownload,
  IconPlayerPlay,
  IconPhoto,
  IconAd2,
  IconBrandTiktok,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';

import { searchAdLibrary } from '@/utils/api/windmill';

/***************************  CONSTANTS  ***************************/

const PLATFORM_COLORS = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  google: '#4285F4',
  tiktok: '#000000',
  youtube: '#FF0000',
  linkedin: '#0A66C2'
};

const PLATFORM_ICONS = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  google: IconBrandGoogle,
  tiktok: IconBrandTiktok
};

const CATEGORIES = [
  { key: 'all', label: 'All Ads' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'saas', label: 'SaaS' },
  { key: 'leadgen', label: 'Lead Gen' },
  { key: 'local', label: 'Local Business' }
];

const HERO_VIDEO = '/videos/hero-ai-robot.mp4';
const APP_LINK = 'https://play.google.com/store/apps/details?id=pro.marketingtool.app';

const IMG = '/images/ad-library/images';
const VID = '/images/ad-library/videos';

/***************************  SAMPLE ADS DATA  ***************************/

const SAMPLE_ADS = [
  { id: 's1', advertiser: 'Shopify', headline: 'Start Selling Online Today', body: 'Build your ecommerce store with Shopify. Free 14-day trial, no credit card required.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bew-store-dash.jpg`, video: `${VID}/ads-manager.mp4`, cta: 'Start Free Trial', startDate: 'Jan 2026', category: 'ecommerce', impressions: 2400000, ctr: '3.2', spend: 185000, country: 'US' },
  { id: 's2', advertiser: 'HubSpot', headline: 'Free CRM for Growing Teams', body: 'Manage contacts, deals, and tasks — all in one place. 100% free forever.', platform: 'google', format: 'Image', thumbnail: `${IMG}/adlib-lead-targeting.jpg`, cta: 'Get Free CRM', startDate: 'Dec 2025', category: 'saas', impressions: 1800000, ctr: '2.8', spend: 142000, country: 'US' },
  { id: 's3', advertiser: 'Nike', headline: 'Just Do It — Air Max 2026', body: 'Lighter. Faster. More cushion than ever. Available now in 12 colorways.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/bew-social-growth.jpg`, video: `${VID}/social-marketing.mp4`, cta: 'Shop Now', startDate: 'Feb 2026', category: 'ecommerce', impressions: 8500000, ctr: '4.1', spend: 520000, country: 'Global' },
  { id: 's4', advertiser: 'Notion', headline: 'Your All-in-One Workspace', body: 'Replace your docs, wikis, and project management tools. AI-powered.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bew-saas-ui.jpg`, video: `${VID}/ai-project.mp4`, cta: 'Try Free', startDate: 'Jan 2026', category: 'saas', impressions: 3200000, ctr: '3.5', spend: 210000, country: 'US' },
  { id: 's5', advertiser: 'Canva', headline: 'Design Anything in Minutes', body: 'Create stunning social media posts and marketing materials with AI.', platform: 'instagram', format: 'Image', thumbnail: `${IMG}/adlib-ai-marketers.jpg`, cta: 'Start Designing', startDate: 'Feb 2026', category: 'saas', impressions: 5600000, ctr: '5.2', spend: 380000, country: 'Global' },
  { id: 's6', advertiser: 'Monday.com', headline: 'Manage Projects Like a Pro', body: 'Visual project management that actually works. Try it free.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-desktop.jpg`, video: `${VID}/saas-dashboard.mp4`, cta: 'Start Free', startDate: 'Dec 2025', category: 'saas', impressions: 1400000, ctr: '2.6', spend: 95000, country: 'US' },
  { id: 's7', advertiser: 'Gymshark', headline: 'Train Hard. Look Good.', body: 'New Spring Collection. Performance meets style.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/adlib-social-growth.jpg`, video: `${VID}/social-phone.mp4`, cta: 'Shop Collection', startDate: 'Feb 2026', category: 'ecommerce', impressions: 4200000, ctr: '4.8', spend: 290000, country: 'UK' },
  { id: 's8', advertiser: 'Mailchimp', headline: 'Email Marketing Made Simple', body: 'AI-powered subject lines, smart scheduling, and detailed analytics.', platform: 'facebook', format: 'Image', thumbnail: `${IMG}/bew-email-ai.jpg`, cta: 'Start Free', startDate: 'Jan 2026', category: 'saas', impressions: 2100000, ctr: '2.9', spend: 155000, country: 'US' },
  { id: 's9', advertiser: 'Stripe', headline: 'Payments for the Internet', body: 'Accept payments online and in person. Trusted by millions.', platform: 'google', format: 'Video', thumbnail: `${IMG}/adlib-saas-dash.jpg`, video: `${VID}/digital-tips.mp4`, cta: 'Start Now', startDate: 'Nov 2025', category: 'saas', impressions: 980000, ctr: '2.4', spend: 78000, country: 'Global' },
  { id: 's10', advertiser: 'Glossier', headline: 'Skin First. Makeup Second.', body: 'Clean beauty essentials. Cruelty-free, dermatologist-tested.', platform: 'instagram', format: 'Image', thumbnail: `${IMG}/adlib-closely.jpg`, cta: 'Shop Now', startDate: 'Feb 2026', category: 'ecommerce', impressions: 3800000, ctr: '4.5', spend: 245000, country: 'US' },
  { id: 's11', advertiser: 'Semrush', headline: 'Dominate Search Results with AI', body: 'Keyword research, competitor analysis, and content optimization.', platform: 'google', format: 'Image', thumbnail: `${IMG}/bew-seo.jpg`, cta: 'Try Free', startDate: 'Jan 2026', category: 'saas', impressions: 1600000, ctr: '3.1', spend: 125000, country: 'US' },
  { id: 's12', advertiser: 'Allbirds', headline: 'Comfort Meets Sustainability', body: 'Most comfortable shoes, made from natural materials.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/adlib-digital.jpg`, video: `${VID}/ai-business.mp4`, cta: 'Shop Shoes', startDate: 'Dec 2025', category: 'ecommerce', impressions: 2900000, ctr: '3.8', spend: 195000, country: 'US' },
  { id: 's13', advertiser: 'Figma', headline: 'Design Together. Build Faster.', body: 'Real-time editing, prototyping, and developer handoff.', platform: 'facebook', format: 'Image', thumbnail: `${IMG}/bew-saas-library.jpg`, cta: 'Start Free', startDate: 'Jan 2026', category: 'saas', impressions: 1200000, ctr: '3.0', spend: 88000, country: 'Global' },
  { id: 's14', advertiser: 'Warby Parker', headline: 'Glasses Starting at $95', body: 'Free shipping and returns. Try 5 frames at home for free.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/adlib-webdesign.jpg`, video: `${VID}/social-templates.mp4`, cta: 'Try at Home', startDate: 'Feb 2026', category: 'ecommerce', impressions: 2200000, ctr: '3.6', spend: 165000, country: 'US' },
  { id: 's15', advertiser: 'Slack', headline: 'Where Work Happens', body: 'Channels, DMs, and AI-powered search. 2,600+ integrations.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-automation.jpg`, video: `${VID}/chatbot.mp4`, cta: 'Get Started', startDate: 'Dec 2025', category: 'saas', impressions: 1500000, ctr: '2.7', spend: 112000, country: 'US' },
  { id: 's16', advertiser: 'Dollar Shave Club', headline: 'A Great Shave for a Few Bucks', body: 'Premium razors delivered. No commitment, skip anytime.', platform: 'facebook', format: 'Image', thumbnail: `${IMG}/adlib-dodgeprint.jpg`, cta: 'Get Started', startDate: 'Jan 2026', category: 'ecommerce', impressions: 3400000, ctr: '4.0', spend: 220000, country: 'US' },
  { id: 's17', advertiser: 'Zoom', headline: 'AI-First Meetings That Work', body: 'Smart summaries, noise cancellation, seamless collaboration.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-ai-tools.jpg`, video: `${VID}/ai-edu.mp4`, cta: 'Sign Up Free', startDate: 'Feb 2026', category: 'saas', impressions: 1100000, ctr: '2.5', spend: 82000, country: 'Global' },
  { id: 's18', advertiser: 'Lululemon', headline: 'New Arrivals: Spring 2026', body: 'Performance wear for yoga, running, and training.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/adlib-facebook2.jpg`, video: `${VID}/social-market.mp4`, cta: 'Shop New', startDate: 'Feb 2026', category: 'ecommerce', impressions: 4800000, ctr: '5.0', spend: 310000, country: 'US' },
  { id: 's19', advertiser: 'Intercom', headline: 'AI Customer Service That Resolves', body: 'Fin AI Agent resolves 50% of support tickets instantly.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bew-digital-robot.jpg`, video: `${VID}/chat-widget.mp4`, cta: 'See Demo', startDate: 'Jan 2026', category: 'saas', impressions: 890000, ctr: '2.3', spend: 68000, country: 'US' },
  { id: 's20', advertiser: 'Peloton', headline: 'Your Home Gym, Reimagined', body: 'Live and on-demand classes. 7M+ members worldwide.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/adlib-markweb.jpg`, video: `${VID}/ad-growth.mp4`, cta: 'Start Trial', startDate: 'Feb 2026', category: 'ecommerce', impressions: 3100000, ctr: '3.7', spend: 205000, country: 'US' },
  { id: 's21', advertiser: 'Ahrefs', headline: 'SEO Data You Can Trust', body: 'Most accurate backlink index and keyword database.', platform: 'google', format: 'Image', thumbnail: `${IMG}/bew-analytics-float.jpg`, cta: 'Start Trial', startDate: 'Dec 2025', category: 'saas', impressions: 750000, ctr: '3.3', spend: 58000, country: 'Global' },
  { id: 's22', advertiser: 'ActiveCampaign', headline: 'Email Automation That Converts', body: 'Trigger personalized emails. Nurture leads automatically.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bew-openai.jpg`, video: `${VID}/ai-data.mp4`, cta: 'Start Free', startDate: 'Jan 2026', category: 'leadgen', impressions: 4500000, ctr: '4.3', spend: 275000, country: 'US' },
  { id: 's23', advertiser: 'Leadpages', headline: 'Landing Pages That Convert 5x More', body: 'AI-powered templates, A/B testing, and analytics.', platform: 'instagram', format: 'Image', thumbnail: `${IMG}/bew-ai-courses.jpg`, cta: 'Try Free', startDate: 'Feb 2026', category: 'leadgen', impressions: 6200000, ctr: '5.5', spend: 420000, country: 'Global' },
  { id: 's24', advertiser: 'SEMrush Local', headline: 'Get Found by Local Customers', body: 'Manage listings across 150+ directories.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-google-ads.jpg`, video: `${VID}/cyber-security.mp4`, cta: 'Try Free', startDate: 'Jan 2026', category: 'local', impressions: 620000, ctr: '2.9', spend: 45000, country: 'US' },

  // --- NEW ADS using uploaded media ---
  { id: 's25', advertiser: 'Meta', headline: 'Scale Your Facebook & Instagram Ads', body: 'Reach 3.7B users. AI-powered targeting finds your ideal audience automatically.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/01105d3179e5710817d925e86f3cc698.png`, video: `${VID}/facebook-and-instagram-ads-setup-for-scalable-growth-convers.mp4`, cta: 'Get Started', startDate: 'Feb 2026', category: 'leadgen', impressions: 9200000, ctr: '4.6', spend: 680000, country: 'Global' },
  { id: 's26', advertiser: 'Tableau', headline: 'Advanced Data Analytics Dashboard', body: 'Futuristic visualization meets real-time business intelligence.', platform: 'google', format: 'Video', thumbnail: `${IMG}/0d5ba2dabad4835552937b83bc74987d.png`, video: `${VID}/advanced-data-analytics-dashboard-display-futurist-2026-01-2.mp4`, cta: 'Try Free', startDate: 'Jan 2026', category: 'saas', impressions: 1900000, ctr: '3.4', spend: 148000, country: 'US' },
  { id: 's27', advertiser: 'Google Ads', headline: 'Digital Marketing Visualization', body: 'See your campaign performance in stunning 3D data visualization.', platform: 'google', format: 'Video', thumbnail: `${IMG}/01b569fd1095ed0daf4f923864e685bc.png`, video: `${VID}/advanced-data-visualization-for-digital-marketing-2026-01-22.mp4`, cta: 'Start Now', startDate: 'Feb 2026', category: 'leadgen', impressions: 7100000, ctr: '3.9', spend: 510000, country: 'Global' },
  { id: 's28', advertiser: 'Asana', headline: 'AI Project Management Agent', body: 'Your AI project manager that handles timelines, tasks, and team coordination.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/63e4258921f62d15eb5a8a62e62b7067.png`, video: `${VID}/ai-agent-project-management-2026-01-28-05-05-25-utc.mp4`, cta: 'Try AI Agent', startDate: 'Jan 2026', category: 'saas', impressions: 2800000, ctr: '3.1', spend: 195000, country: 'US' },
  { id: 's29', advertiser: 'OpenAI', headline: 'AI Business Solutions That Scale', body: 'Enterprise-grade AI that automates workflows and drives revenue growth.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/ae0dca68e671c23400780aeec8a0c5f4.png`, video: `${VID}/ai-business-video-1.mp4`, cta: 'Get Started', startDate: 'Feb 2026', category: 'saas', impressions: 12000000, ctr: '5.8', spend: 920000, country: 'Global' },
  { id: 's30', advertiser: 'Drift', headline: 'Smart Chatbot Automation', body: 'Boost chat widget performance with AI-powered customer engagement.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/55b9f4803fc65aef6c621a43c5da05f3.png`, video: `${VID}/boost-chat-widget-performance-with-smart-chatbot-app-automat.mp4`, cta: 'See Demo', startDate: 'Dec 2025', category: 'saas', impressions: 1350000, ctr: '2.7', spend: 102000, country: 'US' },
  { id: 's31', advertiser: 'Bloomberg', headline: 'Business Chart Analytics', body: 'Real-time market analysis with AI-powered chart insights and predictions.', platform: 'google', format: 'Video', thumbnail: `${IMG}/b80be05da77faf80016911a1d84b531b.png`, video: `${VID}/business-chart-analyst-2026-01-28-03-31-43-utc.mp4`, cta: 'Start Free', startDate: 'Jan 2026', category: 'saas', impressions: 2100000, ctr: '3.2', spend: 168000, country: 'US' },
  { id: 's32', advertiser: 'LinkedIn Ads', headline: 'Digital Marketing Professionals', body: 'Connect with decision-makers. B2B targeting that actually converts.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/c2fa8b59ccfbcd8fcf504b74af27b110.png`, video: `${VID}/business-professionals-engaging-in-digital-marketi-2026-01-2.mp4`, cta: 'Launch Campaign', startDate: 'Feb 2026', category: 'leadgen', impressions: 4200000, ctr: '3.6', spend: 310000, country: 'Global' },
  { id: 's33', advertiser: 'AdRoll', headline: 'Campaign Improvement Breakdown', body: 'See exactly where your ad spend goes. Optimize every dollar with AI insights.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/323e8d56af9bc6f95a7dca12f4c1cca4.png`, video: `${VID}/campaign-improvement-breakdown.mp4`, cta: 'Optimize Now', startDate: 'Jan 2026', category: 'leadgen', impressions: 1750000, ctr: '3.0', spend: 135000, country: 'US' },
  { id: 's34', advertiser: 'Coursera', headline: 'Choose Digital Marketing Career', body: 'Learn digital marketing from top universities. Get certified in 3 months.', platform: 'google', format: 'Video', thumbnail: `${IMG}/58ca16b1db997cc1663f3b0e01554a99.png`, video: `${VID}/choose-digital-marketing-as-your-career.mp4`, cta: 'Enroll Free', startDate: 'Feb 2026', category: 'leadgen', impressions: 3400000, ctr: '4.2', spend: 250000, country: 'Global' },
  { id: 's35', advertiser: 'CrowdStrike', headline: 'Cyber Security for Ad Platforms', body: 'Protect your ad accounts and customer data with enterprise-grade security.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bf09d5db9b42d788b87d25bc52241a60.png`, video: `${VID}/cyber-security-data-protection-and-privacy-concep-2026-01-28.mp4`, cta: 'Get Protected', startDate: 'Jan 2026', category: 'saas', impressions: 980000, ctr: '2.1', spend: 72000, country: 'US' },
  { id: 's36', advertiser: 'Amazon Ads', headline: 'E-commerce Shopping Experience', body: 'Reach 300M+ shoppers. AI-optimized product ads that drive conversions.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/f3a82bce191d066f50fa0ee218d0c315.png`, video: `${VID}/e-commerce-online-shopping-4k-2025-12-09-06-33-23-utc.mp4`, cta: 'Start Selling', startDate: 'Feb 2026', category: 'ecommerce', impressions: 15000000, ctr: '6.2', spend: 1200000, country: 'Global' },
  { id: 's37', advertiser: 'Anthropic', headline: 'AI Analytics with Data Visualization', body: 'Hands-on AI analytics that transform raw data into actionable marketing insights.', platform: 'google', format: 'Video', thumbnail: `${IMG}/a317a899dbdac91d4b734809d1c3cf99.png`, video: `${VID}/hands-engaged-in-ai-analytics-with-data-visualizat-2026-01-2.mp4`, cta: 'See Demo', startDate: 'Jan 2026', category: 'saas', impressions: 2600000, ctr: '3.5', spend: 198000, country: 'US' },
  { id: 's38', advertiser: 'Metaverse Ads', headline: 'Holographic Data Projections', body: 'Next-gen ad analytics with holographic charts and real-time campaign data.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/11b1bae805f8f3f7d9f40aa96bcb6979.png`, video: `${VID}/holographic-data-analysis-and-projections-with-cha-2026-01-2.mp4`, cta: 'Explore Now', startDate: 'Feb 2026', category: 'saas', impressions: 1600000, ctr: '2.8', spend: 125000, country: 'US' },
  { id: 's39', advertiser: 'Snap Inc.', headline: 'Innovative VR Marketing', body: 'Digital marketing meets virtual reality. Immersive ad experiences that convert.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/13b287083237210d9751816eb1198bf8.png`, video: `${VID}/innovative-digital-marketing-with-virtual-reality-2026-01-22.mp4`, cta: 'Create Ad', startDate: 'Jan 2026', category: 'ecommerce', impressions: 5500000, ctr: '4.4', spend: 385000, country: 'Global' },
  { id: 's40', advertiser: 'Datadog', headline: 'Modern Office Analytics', body: 'Real-time infographics and dashboards for your entire marketing stack.', platform: 'google', format: 'Video', thumbnail: `${IMG}/d221397e7bdbd8d6abedd616bdaa1afd.png`, video: `${VID}/modern-office-with-laptop-and-infographics-about-a-2026-01-2.mp4`, cta: 'Start Free', startDate: 'Dec 2025', category: 'saas', impressions: 1100000, ctr: '2.5', spend: 85000, country: 'US' },
  { id: 's41', advertiser: 'TikTok Ads', headline: 'Social Media Background Ads', body: 'Mobile-first social media advertising that grabs attention in seconds.', platform: 'tiktok', format: 'Video', thumbnail: `${IMG}/d72bf484d39cfaf76a050830b7f02662.png`, video: `${VID}/smart-phone-social-media-background-2025-12-09-10-53-29-utc.mp4`, cta: 'Go Viral', startDate: 'Feb 2026', category: 'ecommerce', impressions: 18000000, ctr: '7.1', spend: 1500000, country: 'Global' },
  { id: 's42', advertiser: 'Hootsuite', headline: 'Social Media Marketing Optimization', body: 'Automate, schedule, and optimize your social media marketing campaigns.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/e27eedb93587d150d2c4d9303959f872.png`, video: `${VID}/social-media-marketing-and-optimization-animation-2026-01-28.mp4`, cta: 'Start Free', startDate: 'Jan 2026', category: 'saas', impressions: 3200000, ctr: '3.8', spend: 240000, country: 'US' },
  { id: 's43', advertiser: 'Robinhood', headline: 'Stock Market Mobile Trading', body: 'Commission-free trading with AI-powered market insights on your phone.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/c742742c3fcb62d911c572ca2a6f5189.png`, video: `${VID}/stock-market-in-a-smartphone-2026-01-28-05-11-46-utc.mp4`, cta: 'Download App', startDate: 'Feb 2026', category: 'ecommerce', impressions: 8800000, ctr: '4.9', spend: 650000, country: 'US' },
  { id: 's44', advertiser: 'Boston Dynamics', headline: 'AI Robot Intelligence', body: '4K Meta Universe AI robot. The future of automated advertising is here.', platform: 'google', format: 'Video', thumbnail: `${IMG}/190224841bfca3a837ce69be7f201d2a.png`, video: `${VID}/4k-meta-universe-ai-intelligent-robot-4k-2025-12-09-07-47-47.mp4`, cta: 'Learn More', startDate: 'Jan 2026', category: 'saas', impressions: 6700000, ctr: '4.0', spend: 480000, country: 'Global' },
  { id: 's45', advertiser: 'Google Display', headline: 'Online Display Ads That Convert', body: 'Animated display ads that capture attention. Programmatic buying at scale.', platform: 'google', format: 'Video', thumbnail: `${IMG}/b36e6f8e9ab7c2e39894a67bb47f8160.png`, video: `${VID}/online-display-ads-marketing-animated-scene-2026-01-28-04-12.mp4`, cta: 'Create Ad', startDate: 'Feb 2026', category: 'leadgen', impressions: 4100000, ctr: '3.3', spend: 295000, country: 'US' },
  { id: 's46', advertiser: 'Udemy', headline: 'AI Home Education Revolution', body: 'Learn AI marketing from home. 50+ courses, lifetime access, certificates included.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/6afff8727d01c94db3b9a7209bb2f0ad.png`, video: `${VID}/ai-home-education-2026-01-28-04-40-42-utc.mp4`, cta: 'Start Learning', startDate: 'Jan 2026', category: 'leadgen', impressions: 2900000, ctr: '3.7', spend: 210000, country: 'Global' },
  { id: 's47', advertiser: 'Palantir', headline: 'Tech AI Display Analytics', body: 'Experts scrutinize sophisticated data. Enterprise AI for marketing intelligence.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/077a3149fd779206ad3ef1e14e8faf65.png`, video: `${VID}/tech-ai-displays-experts-scrutinize-sophisticated-2026-01-23.mp4`, cta: 'Request Demo', startDate: 'Feb 2026', category: 'saas', impressions: 850000, ctr: '2.2', spend: 65000, country: 'US' },
  { id: 's48', advertiser: 'Buffer', headline: 'Your Social Media Runs Itself', body: 'AI scheduling, auto-replies, and smart analytics. Social media on autopilot.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/9c139c0ddeb1e805e2fcd975728543bd-3.jpg`, video: `${VID}/your-social-media-can-run-itself-and-so-can-your-customer-ca.mp4`, cta: 'Automate Now', startDate: 'Jan 2026', category: 'saas', impressions: 2400000, ctr: '3.4', spend: 178000, country: 'US' },
  { id: 's49', advertiser: 'SaaS Dashboard', headline: 'Property & SaaS Dashboard', body: 'Beautiful real-time dashboards for your SaaS metrics and property analytics.', platform: 'google', format: 'Video', thumbnail: `${IMG}/a4e6caeb0113201805125d1d3d19ee8e2.jpg`, video: `${VID}/property-dashboard---saas-dashboard.mp4`, cta: 'Try Free', startDate: 'Dec 2025', category: 'saas', impressions: 1300000, ctr: '2.9', spend: 98000, country: 'US' },
  { id: 's50', advertiser: 'HubSpot AI', headline: 'AI-Powered Analytics Revolution', body: 'Swipe up to discover how AI-powered analytics is revolutionizing marketing.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/793b523632d999e3f4dc2c08b7e206e52.jpg`, video: `${VID}/swipe-up-to-discover-how-ai-powered-analytics-is-revolutioni.mp4`, cta: 'Discover Now', startDate: 'Feb 2026', category: 'saas', impressions: 5300000, ctr: '4.5', spend: 370000, country: 'Global' },
  { id: 's51', advertiser: 'Jasper AI', headline: 'AI Content That Converts', body: 'Harness artificial intelligence to analyze complex data and predict trends.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/d18b379458249051d375c1dcd74555dd.webp`, video: `${VID}/we-harness-artificial-intelligence-to-analyze-complex-data-p.mp4`, cta: 'Try Jasper', startDate: 'Jan 2026', category: 'saas', impressions: 3800000, ctr: '3.9', spend: 275000, country: 'US' },
  { id: 's52', advertiser: 'DeepMind', headline: 'Machine Learning for Ads', body: 'Artificial intelligence animation with machine learning that optimizes ad delivery.', platform: 'google', format: 'Video', thumbnail: `${IMG}/mastering-digital-marketing--strategies-for-success-in-a-con.jpeg`, video: `${VID}/artificial-intelligence-animation-with-machine-lea-2025-12-0.mp4`, cta: 'Learn More', startDate: 'Feb 2026', category: 'saas', impressions: 4600000, ctr: '3.6', spend: 340000, country: 'Global' },
  { id: 's53', advertiser: 'Salesforce', headline: 'Custom AI Chatbots for Business', body: 'Deploy custom ChatGPT chatbots that handle sales, support, and lead generation.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/adlib-ai-marketers.jpg`, video: `${VID}/custom-chatgpt-chatbots-for-businesses.mp4`, cta: 'Build Chatbot', startDate: 'Jan 2026', category: 'saas', impressions: 2200000, ctr: '3.0', spend: 165000, country: 'US' },
  { id: 's54', advertiser: 'Wix', headline: 'New Website Launch in Minutes', body: 'Our new website is live — built with AI in under 10 minutes. You can too.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/adlib-digital.jpg`, video: `${VID}/our-new-website-is-live-4.mp4`, cta: 'Build Yours', startDate: 'Feb 2026', category: 'ecommerce', impressions: 6100000, ctr: '4.7', spend: 430000, country: 'Global' },
  { id: 's55', advertiser: 'LangChain', headline: 'LLM Agents for Marketing', body: 'Revolutionary planning methods with LLM agents. Automate your entire ad pipeline.', platform: 'google', format: 'Video', thumbnail: `${IMG}/adlib-saas-dash.jpg`, video: `${VID}/llm-agenten-revolutiona-re-planungsmethoden-enthu-llt.mp4`, cta: 'Explore Agents', startDate: 'Jan 2026', category: 'saas', impressions: 1500000, ctr: '2.8', spend: 115000, country: 'US' },
  { id: 's56', advertiser: 'Microsoft Ads', headline: 'Futuristic Ad Robot', body: 'Futuristic robot hands interacting with digital ad campaigns. The future is now.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/adlib-lead-targeting.jpg`, video: `${VID}/futuristic-robot-hands-interacting-with-digital-ch-2026-01-2.mp4`, cta: 'Try Copilot', startDate: 'Feb 2026', category: 'saas', impressions: 7800000, ctr: '4.1', spend: 560000, country: 'Global' },
  { id: 's57', advertiser: 'Mixpanel', headline: '3D Advertisement Growth', body: '3D animated ad growth visualization. Watch your ROAS climb in real-time.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/adlib-social-growth.jpg`, video: `${VID}/3d-animation-of-advertisement-growth-2026-01-28-04-20-32-utc.mp4`, cta: 'See Growth', startDate: 'Jan 2026', category: 'saas', impressions: 1800000, ctr: '3.2', spend: 140000, country: 'US' },
  { id: 's58', advertiser: 'SAP', headline: 'Executive Analytics Dashboard', body: 'A tycoon reviews analytics on an electronic dashboard. Enterprise-grade insights.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-analytics-float.jpg`, video: `${VID}/a-tycoon-reviews-analytics-on-an-electronic-dashbo-2026-01-2.mp4`, cta: 'Get Demo', startDate: 'Feb 2026', category: 'saas', impressions: 1200000, ctr: '2.4', spend: 92000, country: 'US' },
  { id: 's59', advertiser: 'Twilio', headline: 'Computer Monitor Holographics', body: 'Blue virtual hologram analytics on your monitor. Data-driven ad optimization.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bew-digital-robot.jpg`, video: `${VID}/computer-monitor-animation-with-blue-virtual-holog-2026-01-2.mp4`, cta: 'Start Free', startDate: 'Jan 2026', category: 'saas', impressions: 950000, ctr: '2.3', spend: 68000, country: 'US' },
  { id: 's60', advertiser: 'Norton', headline: 'Cybersecurity for Ad Platforms', body: 'Futuristic cybersecurity protecting your ad accounts and campaign data.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-automation.jpg`, video: `${VID}/futuristic-cybersecurity-concept-with-animated-dat-2026-01-2.mp4`, cta: 'Protect Now', startDate: 'Feb 2026', category: 'saas', impressions: 1400000, ctr: '2.6', spend: 105000, country: 'Global' },
  { id: 's61', advertiser: 'Hologram Inc.', headline: 'Digital Holographic UI', body: 'Holographic user interface projecting campaign data. Next-gen ad management.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/bew-saas-ui.jpg`, video: `${VID}/digital-holographic-user-interface-projecting-data-2026-01-2.mp4`, cta: 'See Future', startDate: 'Jan 2026', category: 'saas', impressions: 2000000, ctr: '3.1', spend: 155000, country: 'US' },
  { id: 's62', advertiser: 'Sprout Social', headline: 'Animated Social Media Ads', body: 'Virtual social media reality backgrounds that make your ads stand out.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/bew-social-growth.jpg`, video: `${VID}/animated-background-virtual-social-media-reality-stock-foota.mp4`, cta: 'Create Ad', startDate: 'Feb 2026', category: 'ecommerce', impressions: 3600000, ctr: '3.8', spend: 260000, country: 'Global' },
  { id: 's63', advertiser: 'The Trade Desk', headline: 'Digital Marketing Tips', body: 'Beginner-friendly social media growth strategies that drive real ad results.', platform: 'facebook', format: 'Video', thumbnail: `${IMG}/bew-openai.jpg`, video: `${VID}/digital-marketing-tips-for-beginners-social-media-growth-str.mp4`, cta: 'Learn Tips', startDate: 'Jan 2026', category: 'leadgen', impressions: 2700000, ctr: '3.3', spend: 195000, country: 'US' },
  { id: 's64', advertiser: 'Pipedrive', headline: 'AI Business Automation', body: 'AI-powered business tools that automate your sales pipeline and ad management.', platform: 'google', format: 'Video', thumbnail: `${IMG}/bew-email-ai.jpg`, video: `${VID}/ai-business-video-4.mp4`, cta: 'Automate Sales', startDate: 'Feb 2026', category: 'saas', impressions: 1650000, ctr: '2.9', spend: 128000, country: 'US' },
  { id: 's65', advertiser: 'McKinsey Digital', headline: 'Future of Business Modeling', body: 'Turn your ideas into intelligent business models with AI-powered predictions.', platform: 'instagram', format: 'Video', thumbnail: `${IMG}/bew-store-dash.jpg`, video: `${VID}/the-future-of-business-modeling-is-here--turn-your-ideas-int.mp4`, cta: 'Explore AI', startDate: 'Jan 2026', category: 'saas', impressions: 3100000, ctr: '3.5', spend: 230000, country: 'Global' }
];

/***************************  AD CARD (PREMIUM)  ***************************/

function AdCard({ ad, saved, onSave, onClick }) {
  const PlatformIcon = PLATFORM_ICONS[ad.platform];
  const videoRef = useRef(null);
  const hasVideo = Boolean(ad.video);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card
      onClick={() => onClick(ad)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 12px 40px rgba(128,90,245,0.15)',
          transform: 'translateY(-4px)'
        },
        '&:hover video': { opacity: 1 },
        '&:hover .ad-thumb-img': { opacity: hasVideo ? 0 : 1 }
      }}
    >
      {/* Image / Video */}
      <Box sx={{ height: 200, bgcolor: 'grey.900', overflow: 'hidden', position: 'relative' }}>
        {/* Fallback thumbnail image */}
        {ad.thumbnail ? (
          <img
            className="ad-thumb-img"
            src={ad.thumbnail}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s', position: hasVideo ? 'absolute' : 'relative', inset: 0, zIndex: 1 }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(128,90,245,0.06)' }}>
            <IconPhoto size={32} style={{ opacity: 0.2 }} />
          </Box>
        )}

        {/* Video (plays on hover) */}
        {hasVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 0, opacity: 0, transition: 'opacity 0.4s' }}
          >
            <source src={ad.video} type="video/mp4" />
          </video>
        )}

        {/* Gradient overlay */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />

        {/* Top bar */}
        <Stack direction="row" sx={{ position: 'absolute', top: 8, left: 8, right: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            {PlatformIcon && (
              <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlatformIcon size={14} color={PLATFORM_COLORS[ad.platform]} />
              </Box>
            )}
            <Chip
              label={ad.platform}
              size="small"
              sx={{
                height: 22, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize',
                bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)',
                borderLeft: `3px solid ${PLATFORM_COLORS[ad.platform] || '#805AF5'}`
              }}
            />
          </Stack>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onSave(ad.id); }}
            sx={{
              width: 28, height: 28, bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
              color: saved ? '#805AF5' : 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            {saved ? <IconBookmarkFilled size={14} /> : <IconBookmark size={14} />}
          </IconButton>
        </Stack>

        {/* Bottom badges */}
        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', bottom: 8, left: 8, right: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          {ad.format && (
            <Chip
              icon={ad.format === 'Video' || ad.format === 'Reels' ? <IconPlayerPlay size={10} /> : undefined}
              label={ad.format}
              size="small"
              sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', '& .MuiChip-icon': { color: 'white' } }}
            />
          )}
          {ad.impressions && (
            <Chip
              icon={<IconEye size={10} />}
              label={`${(ad.impressions / 1000000).toFixed(1)}M`}
              size="small"
              sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', '& .MuiChip-icon': { color: 'white' } }}
            />
          )}
        </Stack>
      </Box>

      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Advertiser */}
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
          <Box sx={{
            width: 20, height: 20, borderRadius: '50%', fontSize: '0.55rem', fontWeight: 700,
            bgcolor: PLATFORM_COLORS[ad.platform] + '18', color: PLATFORM_COLORS[ad.platform],
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            {ad.advertiser?.[0]}
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary' }}>
            {ad.advertiser}
          </Typography>
          {ad.country && (
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled', ml: 'auto' }}>
              {ad.country}
            </Typography>
          )}
        </Stack>

        {/* Headline */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700, mb: 0.5, letterSpacing: '-0.01em',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4
          }}
        >
          {ad.headline || ad.title || 'Untitled Ad'}
        </Typography>

        {/* Body */}
        {ad.body && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5, mb: 1.5 }}
          >
            {ad.body}
          </Typography>
        )}

        {/* Meta row */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={0.5}>
            {ad.ctr && (
              <Chip
                label={`${ad.ctr}% CTR`}
                size="small"
                sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.08)', color: '#10B981' }}
              />
            )}
          </Stack>
          {ad.cta && (
            <Chip
              label={ad.cta}
              size="small"
              sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(128,90,245,0.08)', color: 'primary.main', fontWeight: 600 }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

/***************************  TRENDING CARD (HORIZONTAL)  ***************************/

function TrendingCard({ ad, onClick }) {
  return (
    <Card
      onClick={() => onClick(ad)}
      sx={{
        minWidth: 280, maxWidth: 280, cursor: 'pointer', border: '1px solid', borderColor: 'divider',
        borderRadius: 3, overflow: 'hidden', flexShrink: 0, scrollSnapAlign: 'start',
        transition: 'all 0.3s',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 8px 28px rgba(128,90,245,0.12)', transform: 'translateY(-2px)' }
      }}
    >
      <Box sx={{ height: 140, position: 'relative', overflow: 'hidden' }}>
        <img src={ad.thumbnail} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', bottom: 8, left: 8 }}>
          <Chip label={ad.platform} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)' }} />
          <Chip label={ad.format} size="small" sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)' }} />
        </Stack>
        <Chip
          icon={<IconTrendingUp size={10} />}
          label="Trending"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, height: 20, fontSize: '0.6rem', fontWeight: 600, bgcolor: 'rgba(128,90,245,0.9)', color: 'white', '& .MuiChip-icon': { color: 'white' } }}
        />
      </Box>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', color: 'text.disabled', display: 'block', mb: 0.25 }}>{ad.advertiser}</Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {ad.headline}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }}>
          {ad.impressions && <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>{(ad.impressions / 1000000).toFixed(1)}M views</Typography>}
          {ad.ctr && <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 600 }}>{ad.ctr}% CTR</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

/***************************  STAT CARD  ***************************/

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, flex: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{
            width: 40, height: 40, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: `${color}12`, color
          }}>
            <Icon size={20} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>{label}</Typography>
              {trend && <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.6rem' }}>{trend}</Typography>}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/***************************  LOADING SKELETON  ***************************/

function LoadingGrid() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <Skeleton variant="rectangular" height={200} animation="wave" />
            <CardContent sx={{ p: 2 }}>
              <Skeleton width="35%" height={12} sx={{ mb: 0.75 }} animation="wave" />
              <Skeleton width="85%" height={16} sx={{ mb: 0.5 }} animation="wave" />
              <Skeleton width="65%" height={14} animation="wave" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/***************************  AD DETAIL DIALOG  ***************************/

function AdDetailDialog({ ad, open, onClose, saved, onSave }) {
  if (!ad) return null;

  const PlatformIcon = PLATFORM_ICONS[ad.platform];

  const handleCopy = () => {
    const text = [ad.headline, ad.body, ad.cta].filter(Boolean).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Left: Visual */}
          {(ad.thumbnail || ad.video) && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ height: { xs: 260, md: '100%' }, minHeight: { md: 420 }, bgcolor: 'grey.900', position: 'relative', overflow: 'hidden' }}>
                {ad.video ? (
                  <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                    <source src={ad.video} type="video/mp4" />
                  </video>
                ) : (
                  <img src={ad.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)' }} />
                <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 12, left: 12 }}>
                  {ad.platform && (
                    <Chip label={ad.platform} size="small" sx={{ height: 24, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)' }} />
                  )}
                  {ad.format && (
                    <Chip label={ad.format} size="small" sx={{ height: 24, fontSize: '0.65rem', bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)' }} />
                  )}
                </Stack>
              </Box>
            </Grid>
          )}

          {/* Right: Details */}
          <Grid size={{ xs: 12, md: ad.thumbnail ? 7 : 12 }}>
            <Box sx={{ p: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    {PlatformIcon && (
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: PLATFORM_COLORS[ad.platform] + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlatformIcon size={16} color={PLATFORM_COLORS[ad.platform]} />
                      </Box>
                    )}
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{ad.advertiser}</Typography>
                    {ad.country && <Chip label={ad.country} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />}
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                    {ad.headline || ad.title || 'Untitled Ad'}
                  </Typography>
                  {ad.body && (
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{ad.body}</Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    onClick={() => onSave(ad.id)}
                    sx={{ width: 36, height: 36, bgcolor: saved ? 'rgba(128,90,245,0.1)' : 'transparent' }}
                  >
                    {saved ? <IconBookmarkFilled size={18} color="#805AF5" /> : <IconBookmark size={18} />}
                  </IconButton>
                  <IconButton onClick={onClose} sx={{ width: 36, height: 36 }}>
                    <IconX size={18} />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Tags */}
              <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
                {ad.platform && <Chip label={ad.platform} size="small" sx={{ textTransform: 'capitalize' }} />}
                {ad.format && <Chip label={ad.format} size="small" variant="outlined" />}
                {ad.startDate && <Chip label={`Since ${ad.startDate}`} size="small" variant="outlined" />}
                {ad.cta && <Chip label={ad.cta} size="small" color="primary" />}
                {ad.category && <Chip label={ad.category} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />}
              </Stack>

              {/* Metrics */}
              {(ad.impressions || ad.spend || ad.ctr) && (
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  {ad.impressions && (
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(128,90,245,0.04)', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem', display: 'block' }}>Impressions</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{(ad.impressions / 1000000).toFixed(1)}M</Typography>
                      </Box>
                    </Grid>
                  )}
                  {ad.ctr && (
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.04)', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem', display: 'block' }}>CTR</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10B981' }}>{ad.ctr}%</Typography>
                      </Box>
                    </Grid>
                  )}
                  {ad.spend && (
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(239,68,68,0.04)', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem', display: 'block' }}>Spend</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>${(ad.spend / 1000).toFixed(0)}K</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Actions */}
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button variant="contained" size="small" startIcon={<IconSparkles size={14} />} sx={{ borderRadius: 2 }}>
                  AI Analysis
                </Button>
                <Button variant="outlined" size="small" startIcon={<IconCopy size={14} />} sx={{ borderRadius: 2 }} onClick={handleCopy}>
                  Copy Text
                </Button>
                <Button variant="outlined" size="small" startIcon={<IconDownload size={14} />} sx={{ borderRadius: 2 }}>
                  Save to Board
                </Button>
                {ad.url && (
                  <Button variant="outlined" size="small" startIcon={<IconExternalLink size={14} />} sx={{ borderRadius: 2 }} onClick={() => window.open(ad.url, '_blank')}>
                    View Original
                  </Button>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

/***************************  AD LIBRARY PAGE  ***************************/

export default function AdLibraryPage() {
  const [query, setQuery] = useState('');
  const [platformTab, setPlatformTab] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [apiResults, setApiResults] = useState(null);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const trendingRef = useRef(null);

  const platformTabs = ['all', 'facebook', 'instagram', 'google'];

  // Search via API
  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchAdLibrary({
        query: q,
        platform: platformTabs[platformTab] !== 'all' ? platformTabs[platformTab] : undefined,
        dateRange
      });
      setApiResults(Array.isArray(data) ? data : data?.ads || data?.results || []);
    } catch (err) {
      const msg = err.message || 'Search failed';
      if (msg.includes('404') || msg.includes('not found')) {
        setError('api_not_configured');
      } else {
        setError(msg);
      }
      setApiResults(null);
    } finally {
      setLoading(false);
    }
  }, [query, platformTab, dateRange]);

  const clearSearch = () => {
    setQuery('');
    setApiResults(null);
    setError(null);
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Filter sample ads
  const activePlatform = platformTabs[platformTab];
  let filteredAds = SAMPLE_ADS;

  if (activePlatform !== 'all') {
    filteredAds = filteredAds.filter((ad) => ad.platform === activePlatform);
  }
  if (categoryFilter !== 'all') {
    filteredAds = filteredAds.filter((ad) => ad.category === categoryFilter);
  }
  if (showSaved) {
    filteredAds = filteredAds.filter((ad) => savedIds.includes(ad.id));
  }

  // If API results exist, show those instead
  const displayResults = apiResults !== null ? (showSaved ? apiResults.filter((ad) => savedIds.includes(ad.id)) : apiResults) : null;

  // Trending: top 8 by impressions
  const trendingAds = [...SAMPLE_ADS].sort((a, b) => (b.impressions || 0) - (a.impressions || 0)).slice(0, 8);

  const scrollTrending = (dir) => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const isSearchMode = apiResults !== null;

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {/* HERO SECTION WITH VIDEO */}
      <Card
        sx={{
          border: '1px solid', borderColor: 'divider', borderRadius: 4, overflow: 'hidden',
          position: 'relative', minHeight: { xs: 280, md: 320 }
        }}
      >
        {/* Background Video */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/images/ad-library/images/01b569fd1095ed0daf4f923864e685bc.png"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          {/* Dark overlay for readability */}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.7) 100%)' }} />
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box sx={{
                  width: 42, height: 42, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #805AF5 0%, #06b6d4 100%)',
                  boxShadow: '0 4px 12px rgba(128,90,245,0.4)'
                }}>
                  <IconAd2 size={22} color="white" />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'white' }}>
                    Ad Library
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.25 }}>
                    Discover winning ads from top brands across platforms
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* QUICK STATS */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <StatCard icon={IconAd2} label="Ads Tracked" value="10K+" color="#805AF5" trend="+12%" />
        <StatCard icon={IconEye} label="Total Impressions" value="84M" color="#06b6d4" trend="+8%" />
        <StatCard icon={IconTrendingUp} label="Avg CTR" value="3.5%" color="#10B981" trend="+0.4%" />
        <StatCard icon={IconHeart} label="Saved Ads" value={String(savedIds.length)} color="#f43f5e" />
      </Stack>

      {/* ERROR STATES */}
      {error === 'api_not_configured' && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Ad Library search is not configured yet. Showing sample ads below.
        </Alert>
      )}
      {error && error !== 'api_not_configured' && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {/* SEARCH RESULTS MODE */}
      {isSearchMode && !loading && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Button size="small" startIcon={<IconChevronLeft size={14} />} onClick={clearSearch} sx={{ borderRadius: 2 }}>
                Back to Library
              </Button>
              <Typography variant="body2" color="text.secondary">
                {displayResults?.length || 0} results for &ldquo;{query}&rdquo;
              </Typography>
            </Stack>
            <Button
              variant={showSaved ? 'contained' : 'outlined'}
              size="small"
              startIcon={showSaved ? <IconBookmarkFilled size={14} /> : <IconBookmark size={14} />}
              onClick={() => setShowSaved(!showSaved)}
              sx={{ borderRadius: 2 }}
            >
              Saved ({savedIds.length})
            </Button>
          </Stack>

          {displayResults && displayResults.length > 0 ? (
            <Grid container spacing={2}>
              {displayResults.map((ad, idx) => (
                <Grid key={ad.id || idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AdCard ad={ad} saved={savedIds.includes(ad.id)} onSave={toggleSave} onClick={setSelectedAd} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>No ads found</Typography>
                <Typography variant="body2" color="text.secondary">Try a different search term or adjust your filters.</Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* LOADING */}
      {loading && <LoadingGrid />}

      {/* BROWSE MODE (DEFAULT) */}
      {!isSearchMode && !loading && (
        <>
          {/* TRENDING SECTION */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                  <IconTrendingUp size={16} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Trending Now</Typography>
                <Chip label="Hot" size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(239,68,68,0.08)', color: '#ef4444' }} />
              </Stack>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => scrollTrending(-1)} sx={{ border: '1px solid', borderColor: 'divider', width: 30, height: 30 }}>
                  <IconChevronLeft size={16} />
                </IconButton>
                <IconButton size="small" onClick={() => scrollTrending(1)} sx={{ border: '1px solid', borderColor: 'divider', width: 30, height: 30 }}>
                  <IconChevronRight size={16} />
                </IconButton>
              </Stack>
            </Stack>

            <Box
              ref={trendingRef}
              sx={{
                display: 'flex', gap: 2, overflowX: 'auto', pb: 1,
                scrollSnapType: 'x mandatory', scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 }
              }}
            >
              {trendingAds.map((ad) => (
                <TrendingCard key={ad.id} ad={ad} onClick={setSelectedAd} />
              ))}
            </Box>
          </Box>

          {/* BROWSE ALL SECTION */}
          <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(128,90,245,0.08)', color: '#805AF5' }}>
                  <IconLayoutGrid size={16} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Browse Ads</Typography>
                <Typography variant="caption" color="text.disabled">{filteredAds.length} ads</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant={showSaved ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={showSaved ? <IconBookmarkFilled size={14} /> : <IconBookmark size={14} />}
                  onClick={() => setShowSaved(!showSaved)}
                  sx={{ borderRadius: 2 }}
                >
                  Saved ({savedIds.length})
                </Button>
              </Stack>
            </Stack>

            {/* Search bar */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
              <TextField
                placeholder="Search by brand, keyword, or industry..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                fullWidth
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: 2.5, '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(128,90,245,0.1)' } }
                }}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><IconSearch size={18} /></InputAdornment>,
                    endAdornment: query && <InputAdornment position="end"><IconButton size="small" onClick={clearSearch}><IconX size={14} /></IconButton></InputAdornment>
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!query.trim() || loading}
                sx={{
                  borderRadius: 2.5, minWidth: 100, px: 3, fontWeight: 700,
                  background: 'linear-gradient(135deg, #805AF5 0%, #6366f1 100%)'
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
              </Button>
            </Stack>

            {/* Platform Tabs */}
            <Tabs
              value={platformTab}
              onChange={(_, v) => setPlatformTab(v)}
              sx={{
                mb: 2, minHeight: 36,
                '& .MuiTab-root': { minHeight: 36, py: 0, px: 2, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', borderRadius: 2 },
                '& .MuiTabs-indicator': { borderRadius: 2, height: 3 }
              }}
            >
              <Tab label="All Platforms" />
              <Tab icon={<IconBrandFacebook size={14} />} iconPosition="start" label="Facebook" />
              <Tab icon={<IconBrandInstagram size={14} />} iconPosition="start" label="Instagram" />
              <Tab icon={<IconBrandGoogle size={14} />} iconPosition="start" label="Google" />
            </Tabs>

            {/* Category Chips */}
            <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: 2.5 }}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.key}
                  label={cat.label}
                  size="small"
                  variant={categoryFilter === cat.key ? 'filled' : 'outlined'}
                  onClick={() => setCategoryFilter(cat.key)}
                  sx={{
                    cursor: 'pointer', height: 28, fontSize: '0.75rem', fontWeight: 500,
                    ...(categoryFilter === cat.key && { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }),
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                />
              ))}
            </Stack>

            {/* Ads Grid */}
            {filteredAds.length > 0 ? (
              <Grid container spacing={2}>
                {filteredAds.map((ad) => (
                  <Grid key={ad.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <AdCard ad={ad} saved={savedIds.includes(ad.id)} onSave={toggleSave} onClick={setSelectedAd} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ py: 6, textAlign: 'center' }}>
                  {showSaved ? (
                    <>
                      <IconBookmark size={44} style={{ opacity: 0.12, marginBottom: 12 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>No saved ads</Typography>
                      <Typography variant="body2" color="text.secondary">Bookmark ads to save them here.</Typography>
                    </>
                  ) : (
                    <>
                      <IconFilter size={44} style={{ opacity: 0.12, marginBottom: 12 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>No ads match your filters</Typography>
                      <Typography variant="body2" color="text.secondary">Try adjusting platform or category filters.</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        </>
      )}

      {/* Detail Dialog */}
      <AdDetailDialog
        ad={selectedAd}
        open={Boolean(selectedAd)}
        onClose={() => setSelectedAd(null)}
        saved={selectedAd ? savedIds.includes(selectedAd.id) : false}
        onSave={toggleSave}
      />
    </Stack>
  );
}
