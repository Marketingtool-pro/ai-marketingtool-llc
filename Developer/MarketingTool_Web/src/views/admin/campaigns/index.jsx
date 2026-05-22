import { useState, useMemo, useRef, useEffect } from 'react';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';

// @assets
import {
  IconSearch,
  IconPlus,
  IconX,
  IconArrowRight,
  IconArrowLeft,
  IconUpload,
  IconPhoto,
  IconPlayerPlay,
  IconPlayerPause,
  IconCopy,
  IconEye,
  IconRocket,
  IconCheck,
  IconSparkles
} from '@tabler/icons-react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import { createCampaign, getRunStatus, fetchCampaigns, fetchConnectedAccounts } from '@/utils/api/windmill';

/***************************  CONSTANTS  ***************************/

const STATUS_MAP = {
  active: { label: 'Active', color: 'success' },
  paused: { label: 'Paused', color: 'warning' },
  completed: { label: 'Completed', color: 'info' },
  draft: { label: 'Draft', color: 'default' },
  review: { label: 'In Review', color: 'secondary' }
};

const STEPS = ['Platform & Objective', 'Campaign Setup', 'Audience', 'Ad Creative', 'Review & Launch'];

const META_OBJECTIVES = [
  { value: 'conversions', label: 'Conversions', desc: 'Drive valuable actions on your website or app', icon: '🎯' },
  { value: 'traffic', label: 'Traffic', desc: 'Send people to your website or landing page', icon: '🔗' },
  { value: 'awareness', label: 'Brand Awareness', desc: 'Reach people likely to remember your ads', icon: '📢' },
  { value: 'leads', label: 'Lead Generation', desc: 'Collect leads with instant forms', icon: '📋' },
  { value: 'engagement', label: 'Engagement', desc: 'Get more likes, comments, shares', icon: '💬' },
  { value: 'app_installs', label: 'App Installs', desc: 'Get people to install your app', icon: '📱' },
  { value: 'video_views', label: 'Video Views', desc: 'Get more people to watch your videos', icon: '🎬' },
  { value: 'messages', label: 'Messages', desc: 'Conversations on Messenger, WhatsApp, IG', icon: '💌' }
];

const GOOGLE_OBJECTIVES = [
  { value: 'search', label: 'Search Ads', desc: 'Top of Google Search results', icon: '🔍' },
  { value: 'display', label: 'Display Ads', desc: 'Visual ads across millions of websites', icon: '🖼️' },
  { value: 'shopping', label: 'Shopping Ads', desc: 'Products with images, prices, reviews', icon: '🛒' },
  { value: 'video', label: 'Video Ads', desc: 'Reach people on YouTube', icon: '▶️' },
  { value: 'performance_max', label: 'Performance Max', desc: 'AI-optimized across all Google channels', icon: '🚀' },
  { value: 'app', label: 'App Campaigns', desc: 'Drive app installs and in-app actions', icon: '📲' }
];

const META_PLACEMENTS = ['Facebook Feed', 'Instagram Feed', 'Instagram Stories', 'Instagram Reels', 'Facebook Stories', 'Facebook Marketplace', 'Messenger Inbox', 'Audience Network'];
const GOOGLE_NETWORKS = ['Google Search', 'Search Partners', 'Display Network', 'YouTube', 'Gmail', 'Discover'];
const CTA_OPTIONS = ['Shop Now', 'Learn More', 'Sign Up', 'Get Offer', 'Book Now', 'Contact Us', 'Download', 'Subscribe', 'Apply Now', 'Get Quote', 'Watch More', 'Send Message'];

/***************************  IMAGE UPLOAD  ***************************/

function ImageUploader({ images, onAdd, onRemove, platform }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => onAdd({ url: e.target.result, name: file.name, size: file.size });
      reader.readAsDataURL(file);
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Ad Images</Typography>
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: dragging ? 'primary.main' : 'rgba(255,255,255,0.12)',
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragging ? 'rgba(128,90,245,0.06)' : 'transparent',
          transition: 'all 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(128,90,245,0.04)' }
        }}
      >
        <IconUpload size={36} style={{ opacity: 0.4 }} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Drag & drop images here or <span style={{ color: '#805AF5', fontWeight: 600 }}>browse files</span>
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
          {platform === 'meta' ? 'Recommended: 1080×1080 (Feed) or 1080×1920 (Stories) • PNG, JPG up to 30MB' : 'Recommended: 1200×628 (Display) or 1200×1200 (Responsive) • PNG, JPG up to 5MB'}
        </Typography>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </Box>
      {images.length > 0 && (
        <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap', gap: 1.5 }}>
          {images.map((img, i) => (
            <Box key={i} sx={{ position: 'relative', width: 120, height: 120, borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', width: 24, height: 24, '&:hover': { bgcolor: 'error.main' } }}
              >
                <IconX size={12} />
              </IconButton>
              <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 0.5, py: 0.25, fontSize: '0.6rem', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {img.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

/***************************  AD PREVIEW  ***************************/

function AdPreview({ platform, form }) {
  if (platform === 'meta') {
    return (
      <Box sx={{ position: 'sticky', top: 20 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Facebook Feed Preview</Typography>
        <Card sx={{ maxWidth: 420, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(24,119,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/icons/facebook-3d.png" alt="" width={24} height={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{form.businessName || 'Your Business Name'}</Typography>
                <Typography variant="caption" color="text.disabled">Sponsored</Typography>
              </Box>
            </Stack>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              {form.primaryText || 'Your ad primary text goes here. Write compelling copy that speaks to your audience and drives them to take action.'}
            </Typography>
            <Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {form.images?.length > 0 ? (
                <img src={form.images[0].url} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Stack sx={{ alignItems: 'center', gap: 1 }}>
                  <IconPhoto size={48} style={{ opacity: 0.15 }} />
                  <Typography variant="caption" color="text.disabled">Upload an image to preview</Typography>
                </Stack>
              )}
            </Box>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 1.5, borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>{form.landingUrl || 'yourwebsite.com'}</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.25 }}>{form.headline || 'Your Headline Goes Here'}</Typography>
              <Typography variant="caption" color="text.secondary">{form.description || 'Your description text'}</Typography>
            </Box>
            <Button variant="contained" size="small" fullWidth sx={{ mt: 2, textTransform: 'none', borderRadius: 1.5 }}>
              {form.cta || 'Learn More'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'sticky', top: 20 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Google Search Preview</Typography>
      <Card sx={{ maxWidth: 600, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/icons/marketing-strategy-3d.png" alt="" width={14} height={14} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{form.businessName || 'Your Business'}</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontSize: '0.65rem' }}>{form.displayUrl || 'www.yoursite.com'}</Typography>
            </Box>
            <Chip label="Ad" size="small" sx={{ height: 16, fontSize: '0.55rem', ml: 0.5, bgcolor: 'rgba(255,255,255,0.08)' }} />
          </Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#8AB4F8', lineHeight: 1.3 }}>
            {form.headline || 'Your Headline'}{form.headline2 ? ` | ${form.headline2}` : ''}{form.headline3 ? ` | ${form.headline3}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.5 }}>
            {form.description || 'Your ad description will appear here. Write compelling copy that highlights your unique value proposition.'}
          </Typography>
          {form.description2 && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{form.description2}</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

/***************************  FULL PAGE CAMPAIGN BUILDER  ***************************/

function CampaignBuilder({ onSave, onCancel, accounts }) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [launchPhase, setLaunchPhase] = useState(null); // null | 'launching' | 'polling' | 'done' | 'error'
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchStatus, setLaunchStatus] = useState('');
  const [launchError, setLaunchError] = useState(null);
  const [launchOutput, setLaunchOutput] = useState(null);
  const pollRef = useRef(null);
  const startTimeRef = useRef(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [form, setForm] = useState({
    platform: null,
    objective: '',
    name: '',
    budget: 50,
    budgetType: 'daily',
    startDate: '',
    endDate: '',
    noEndDate: true,
    landingUrl: '',
    locations: '',
    ageRange: [18, 65],
    gender: 'All',
    interests: '',
    languages: 'English',
    customAudience: '',
    excludeAudience: '',
    placements: [],
    autoPlacement: true,
    headline: '',
    headline2: '',
    headline3: '',
    description: '',
    description2: '',
    primaryText: '',
    businessName: '',
    displayUrl: '',
    cta: 'Learn More',
    images: [],
    sitelinks: []
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const objectives = form.platform === 'google' ? GOOGLE_OBJECTIVES : META_OBJECTIVES;
  const placements = form.platform === 'google' ? GOOGLE_NETWORKS : META_PLACEMENTS;
  const canNext = () => {
    if (activeStep === 0) return form.platform && form.objective;
    if (activeStep === 1) return form.name;
    return true;
  };

  // AI Auto-Generate: customer enters brand/URL → AI fills everything
  const handleAiGenerate = async () => {
    if (!form.landingUrl && !form.name) return;
    setAiGenerating(true);
    try {
      const res = await createCampaign({
        platform: form.platform,
        accountId: selectedAccount || '',
        campaignData: {
          name: form.name || form.landingUrl,
          objective: form.objective,
          website_url: form.landingUrl,
          daily_budget: form.budget,
          geo: form.locations || 'United States',
          details: `Brand: ${form.name || form.landingUrl}, objective: ${form.objective}`,
        },
        userId: user?.id || 'anonymous'
      });

      if (res?.success && res?.data) {
        const d = res.data;
        setAiSuggestions(res);

        // Auto-fill form fields from AI response
        const campaign = d.campaign || {};
        const ads = d.ads || [];
        const adGroups = d.adGroups || d.adSets || [];
        const firstAd = ads[0] || {};

        setForm((p) => ({
          ...p,
          name: p.name || campaign.name || p.name,
          locations: campaign.location || p.locations,
          headline: firstAd.headlines?.[0] || firstAd.headline || p.headline,
          headline2: firstAd.headlines?.[1] || p.headline2,
          headline3: firstAd.headlines?.[2] || p.headline3,
          description: firstAd.descriptions?.[0] || firstAd.description || p.description,
          description2: firstAd.descriptions?.[1] || p.description2,
          primaryText: firstAd.primaryText || p.primaryText,
          cta: firstAd.cta || p.cta,
          interests: adGroups[0]?.keywords?.join(', ') || adGroups[0]?.targeting?.interests?.join(', ') || p.interests,
        }));
      }
    } catch (err) {
      console.error('AI generate failed:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Cleanup polling on unmount
  const cleanupPoll = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };

  const handleLaunch = async () => {
    setSaving(true);
    setLaunchPhase('launching');
    setLaunchProgress(0);
    setLaunchStatus('Submitting campaign to ' + (form.platform === 'google' ? 'Google Ads' : 'Meta Ads') + '...');
    setLaunchError(null);
    setLaunchOutput(null);
    startTimeRef.current = Date.now();

    try {
      const campaignData = {
        name: form.name || 'Untitled Campaign',
        objective: form.objective,
        budget: form.budget,
        budgetType: form.budgetType,
        startDate: form.startDate,
        endDate: form.noEndDate ? null : form.endDate,
        landingUrl: form.landingUrl,
        locations: form.locations,
        ageRange: form.ageRange,
        gender: form.gender,
        interests: form.interests,
        languages: form.languages,
        placements: form.autoPlacement ? 'auto' : form.placements,
        headline: form.headline,
        headline2: form.headline2,
        headline3: form.headline3,
        description: form.description,
        description2: form.description2,
        primaryText: form.primaryText,
        businessName: form.businessName,
        displayUrl: form.displayUrl,
        cta: form.cta,
        imageCount: form.images.length,
      };

      const response = await createCampaign({
        platform: form.platform,
        accountId: selectedAccount || '',
        campaignData,
        userId: user?.id || 'anonymous'
      });

      const runId = response?.run_id || response?.job_id;

      // Engine returns directly (new campaign engines)
      if (response?.success || response?.engine || response?.data) {
        setLaunchOutput(response);
        setLaunchPhase('done');
        setLaunchProgress(100);
        setLaunchStatus('Campaign blueprint generated!');
        onSave({
          id: response?.campaignId || Date.now(),
          name: form.name || 'Untitled Campaign',
          platform: form.platform,
          status: 'draft',
          budget: form.budgetType === 'daily' ? form.budget * 30 : form.budget,
          spend: 0, results: 0, cpa: 0,
          objective: objectives.find((o) => o.value === form.objective)?.label || form.objective,
          startDate: form.startDate,
          image: form.platform === 'google' ? '/images/icons/marketing-strategy-3d.png' : '/images/icons/facebook-3d.png',
          createdAt: new Date().toISOString()
        });
        setSaving(false);
        return;
      }

      if (!runId) {
        throw new Error('No response from campaign engine');
      }

      // Poll for status
      setLaunchPhase('polling');
      setLaunchProgress(15);
      setLaunchStatus('Campaign submitted. Processing...');

      pollRef.current = setInterval(async () => {
        try {
          const status = await getRunStatus({ runId });
          const elapsed = Date.now() - startTimeRef.current;

          if (status?.status === 'completed') {
            cleanupPoll();
            setLaunchProgress(100);
            setLaunchOutput(status.output_json || status.output || status);
            setLaunchPhase('done');
            setLaunchStatus('Campaign created successfully!');

            const outputData = status.output_json || status.output || {};
            onSave({
              id: outputData?.campaign_id || runId,
              name: form.name || 'Untitled Campaign',
              platform: form.platform,
              status: 'review',
              budget: form.budgetType === 'daily' ? form.budget * 30 : form.budget,
              spend: 0, results: 0, cpa: 0,
              objective: objectives.find((o) => o.value === form.objective)?.label || form.objective,
              startDate: form.startDate,
              image: form.platform === 'google' ? '/images/icons/marketing-strategy-3d.png' : '/images/icons/facebook-3d.png',
              createdAt: new Date().toISOString()
            });
            setSaving(false);
          } else if (status?.status === 'failed') {
            cleanupPoll();
            setLaunchError(status.error || 'Campaign creation failed');
            setLaunchPhase('error');
            setSaving(false);
          } else {
            setLaunchProgress(Math.min(90, 15 + (elapsed / 180000) * 75));
            setLaunchStatus(status?.status === 'running' ? 'Creating campaign...' : 'Queued...');
          }

          // Timeout after 3 minutes
          if (elapsed > 180000) {
            cleanupPoll();
            setLaunchError('Timed out after 3 minutes. Check your campaigns list.');
            setLaunchPhase('error');
            setSaving(false);
          }
        } catch { /* skip tick */ }
      }, 2500);
    } catch (err) {
      setLaunchError(err.message || 'Failed to create campaign');
      setLaunchPhase('error');
      setSaving(false);
    }
  };

  return (
    <Stack spacing={0} sx={{ width: '100%' }}>
      {/* Top bar */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
          <Button variant="text" startIcon={<IconArrowLeft size={16} />} onClick={onCancel} sx={{ color: 'text.secondary' }}>
            Back to Campaigns
          </Button>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            {form.platform && (
              <img src={form.platform === 'google' ? '/images/icons/marketing-strategy-3d.png' : '/images/icons/facebook-3d.png'} alt="" width={28} height={28} />
            )}
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {form.platform ? `New ${form.platform === 'google' ? 'Google' : 'Meta'} Campaign` : 'Create Campaign'}
            </Typography>
          </Stack>
        </Stack>
        {activeStep === STEPS.length - 1 && (
          <Button variant="contained" color="success" onClick={handleLaunch} disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconRocket size={18} />} sx={{ px: 4, height: 44 }}>
            {saving ? 'Launching...' : 'Launch Campaign'}
          </Button>
        )}
      </Stack>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
        {STEPS.map((label, i) => (
          <Step key={label} completed={i < activeStep}>
            <StepLabel
              sx={{ cursor: i < activeStep ? 'pointer' : 'default' }}
              onClick={() => { if (i < activeStep) setActiveStep(i); }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 0: Platform & Objective */}
      {activeStep === 0 && (
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Select Platform</Typography>
            <Grid container spacing={3}>
              {[
                { key: 'google', name: 'Google Ads', sub: 'Search, Display, Shopping, YouTube, Performance Max', img: '/images/icons/marketing-strategy-3d.png' },
                { key: 'meta', name: 'Meta Ads', sub: 'Facebook, Instagram, Messenger, Audience Network', img: '/images/icons/facebook-3d.png' }
              ].map((p) => (
                <Grid key={p.key} size={{ xs: 12, sm: 6 }}>
                  <Card
                    onClick={() => { update('platform', p.key); update('objective', ''); }}
                    sx={{
                      p: 4, cursor: 'pointer', textAlign: 'center',
                      border: '2px solid', borderColor: form.platform === p.key ? 'primary.main' : 'rgba(255,255,255,0.06)',
                      bgcolor: form.platform === p.key ? 'rgba(128,90,245,0.08)' : 'transparent',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: 4 },
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={p.img} alt={p.name} width={72} height={72} style={{ objectFit: 'contain' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{p.sub}</Typography>
                    {form.platform === p.key && <Chip label="Selected" size="small" color="primary" sx={{ mt: 1.5 }} />}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Account Selector */}
          {form.platform && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Ad Account</Typography>
              <FormControl fullWidth>
                <InputLabel>Select {form.platform === 'google' ? 'Google' : 'Meta'} Ad Account</InputLabel>
                <Select value={selectedAccount} label={`Select ${form.platform === 'google' ? 'Google' : 'Meta'} Ad Account`} onChange={(e) => setSelectedAccount(e.target.value)}>
                  <MenuItem value="" disabled>{(accounts || []).filter((a) => a.platform === form.platform).length === 0 ? 'No accounts connected' : 'Select account...'}</MenuItem>
                  {(accounts || []).filter((a) => a.platform === form.platform).map((acc) => (
                    <MenuItem key={acc.id || acc.account_id} value={acc.id || acc.account_id}>{acc.name || acc.account_name || acc.id}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(accounts || []).filter((a) => a.platform === form.platform).length === 0 && (
                <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>No {form.platform === 'google' ? 'Google' : 'Meta'} ad account connected. Connect one in Settings → Connected Services.</Alert>
              )}
            </Box>
          )}

          {form.platform && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Campaign Objective</Typography>
              <Grid container spacing={2}>
                {objectives.map((obj) => (
                  <Grid key={obj.value} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      onClick={() => update('objective', obj.value)}
                      sx={{
                        p: 2.5, cursor: 'pointer', height: '100%',
                        border: '2px solid', borderColor: form.objective === obj.value ? 'primary.main' : 'rgba(255,255,255,0.06)',
                        bgcolor: form.objective === obj.value ? 'rgba(128,90,245,0.08)' : 'transparent',
                        '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s'
                      }}
                    >
                      <Typography variant="h5" sx={{ mb: 0.5 }}>{obj.icon}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{obj.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{obj.desc}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Stack>
      )}

      {/* Step 1: Campaign Setup */}
      {activeStep === 1 && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Campaign Details</Typography>
                <Stack spacing={3}>
                  <TextField label="Campaign Name" fullWidth value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={form.platform === 'google' ? 'e.g. Google Search - Brand Keywords Q1 2026' : 'e.g. Meta Conversions - Summer Sale 2026'} required />
                  <TextField label="Landing Page URL" fullWidth value={form.landingUrl} onChange={(e) => update('landingUrl', e.target.value)} placeholder="https://yoursite.com/landing-page" type="url" />

                  {/* AI Auto-Generate Button */}
                  <Button
                    variant="contained"
                    onClick={handleAiGenerate}
                    disabled={aiGenerating || (!form.name && !form.landingUrl)}
                    startIcon={aiGenerating ? <CircularProgress size={18} color="inherit" /> : <IconSparkles size={18} />}
                    sx={{
                      py: 1.5, borderRadius: 3, fontWeight: 700, fontSize: '0.9rem', textTransform: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                      boxShadow: '0 4px 24px -4px rgba(99,102,241,0.45)',
                      '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)', transform: 'translateY(-1px)' },
                      '&.Mui-disabled': { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' },
                    }}
                  >
                    {aiGenerating ? 'AI Generating Campaign...' : 'AI Generate — Headlines, Copy, Audience, Budget'}
                  </Button>

                  {/* AI Suggestions Preview */}
                  {aiSuggestions?.data && (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      AI filled headlines, descriptions, audience targeting, and CTA. Review each step and adjust as needed.
                      {aiSuggestions.data.recommendations?.length > 0 && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.8 }}>
                          Tip: {aiSuggestions.data.recommendations[0]}
                        </Typography>
                      )}
                    </Alert>
                  )}

                  <Divider />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Budget</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Budget Type</InputLabel>
                        <Select value={form.budgetType} label="Budget Type" onChange={(e) => update('budgetType', e.target.value)}>
                          <MenuItem value="daily">Daily Budget</MenuItem>
                          <MenuItem value="lifetime">Lifetime Budget</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField label={form.budgetType === 'daily' ? 'Daily Budget' : 'Lifetime Budget'} type="number" fullWidth value={form.budget} onChange={(e) => update('budget', Math.max(1, Number(e.target.value)))} slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }} />
                    </Grid>
                  </Grid>
                  <Alert severity="info" variant="outlined" sx={{ py: 0.5 }}>
                    {form.budgetType === 'daily' ? `Estimated monthly spend: $${(form.budget * 30).toLocaleString()}` : `Estimated daily spend: $${Math.round(form.budget / 30).toLocaleString()}`}
                  </Alert>
                  <Divider />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Schedule</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField label="Start Date" type="date" fullWidth value={form.startDate} onChange={(e) => update('startDate', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField label="End Date" type="date" fullWidth value={form.endDate} onChange={(e) => update('endDate', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} disabled={form.noEndDate} />
                    </Grid>
                  </Grid>
                  <FormControlLabel control={<Switch checked={form.noEndDate} onChange={(e) => update('noEndDate', e.target.checked)} />} label="Run continuously (no end date)" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Campaign Summary</Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.disabled">Platform</Typography>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <img src={form.platform === 'google' ? '/images/icons/marketing-strategy-3d.png' : '/images/icons/facebook-3d.png'} alt="" width={20} height={20} />
                      <Typography variant="subtitle2">{form.platform === 'google' ? 'Google Ads' : 'Meta Ads'}</Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.disabled">Objective</Typography>
                    <Typography variant="subtitle2">{objectives.find((o) => o.value === form.objective)?.label || '—'}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.disabled">Campaign Name</Typography>
                    <Typography variant="subtitle2">{form.name || '—'}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.disabled">{form.budgetType === 'daily' ? 'Daily Budget' : 'Lifetime Budget'}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>${form.budget.toLocaleString()}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Step 2: Audience */}
      {activeStep === 2 && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Audience Targeting</Typography>
                <Stack spacing={3}>
                  <TextField label="Target Locations" fullWidth value={form.locations} onChange={(e) => update('locations', e.target.value)} placeholder="e.g. United States, United Kingdom, Canada, Australia" helperText="Separate multiple locations with commas" />
                  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Age Range: {form.ageRange[0]} — {form.ageRange[1]}{form.ageRange[1] === 65 ? '+' : ''}</Typography>
                      <Slider value={form.ageRange} onChange={(_, v) => update('ageRange', v)} min={13} max={65} valueLabelDisplay="auto" />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select value={form.gender} label="Gender" onChange={(e) => update('gender', e.target.value)}>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <TextField label="Interests & Keywords" fullWidth multiline rows={3} value={form.interests} onChange={(e) => update('interests', e.target.value)} placeholder={form.platform === 'google' ? 'e.g. marketing software, CRM tools, SaaS, business automation' : 'e.g. Digital Marketing, E-commerce, Entrepreneurship, Small Business'} helperText="Separate with commas" />
                  <TextField label="Languages" fullWidth value={form.languages} onChange={(e) => update('languages', e.target.value)} />
                  <Divider />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Placements</Typography>
                  <FormControlLabel control={<Switch checked={form.autoPlacement} onChange={(e) => update('autoPlacement', e.target.checked)} />} label={form.platform === 'meta' ? 'Advantage+ Placements (recommended)' : 'Auto-optimize networks (recommended)'} />
                  {!form.autoPlacement && (
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {placements.map((p) => {
                        const sel = form.placements.includes(p);
                        return <Chip key={p} label={p} size="small" variant={sel ? 'filled' : 'outlined'} color={sel ? 'primary' : 'default'} onClick={() => update('placements', sel ? form.placements.filter((x) => x !== p) : [...form.placements, p])} sx={{ cursor: 'pointer' }} />;
                      })}
                    </Stack>
                  )}
                  <Divider />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Advanced (Optional)</Typography>
                  <TextField label="Custom Audience" fullWidth value={form.customAudience} onChange={(e) => update('customAudience', e.target.value)} placeholder={form.platform === 'meta' ? 'e.g. Website visitors 30 days, Lookalike 1%' : 'e.g. Customer match list, Similar audiences'} />
                  <TextField label="Exclude Audience" fullWidth value={form.excludeAudience} onChange={(e) => update('excludeAudience', e.target.value)} placeholder="e.g. Existing customers, Past purchasers" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Estimated Reach</Typography>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>2.4M — 7.1M</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>estimated people</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1.5}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.disabled">Location</Typography>
                    <Typography variant="caption">{form.locations || 'All'}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.disabled">Age</Typography>
                    <Typography variant="caption">{form.ageRange[0]}–{form.ageRange[1]}{form.ageRange[1] === 65 ? '+' : ''}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.disabled">Gender</Typography>
                    <Typography variant="caption">{form.gender}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.disabled">Placements</Typography>
                    <Typography variant="caption">{form.autoPlacement ? 'Auto' : `${form.placements.length} selected`}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Step 3: Ad Creative */}
      {activeStep === 3 && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Ad Creative</Typography>
                <Stack spacing={3}>
                  <TextField label="Business / Brand Name" fullWidth value={form.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="Your company or brand name" />
                  {form.platform === 'meta' && (
                    <TextField label="Primary Text" fullWidth multiline rows={3} value={form.primaryText} onChange={(e) => update('primaryText', e.target.value)} placeholder="Write the main body text. This appears above the image in the feed." helperText={`${form.primaryText.length}/125 characters recommended`} />
                  )}
                  <TextField label={form.platform === 'google' ? 'Headline 1 (required)' : 'Headline'} fullWidth value={form.headline} onChange={(e) => update('headline', e.target.value)} placeholder={form.platform === 'google' ? 'e.g. Get 50% Off Marketing Tools' : 'e.g. Transform Your Marketing Today'} helperText={`${form.headline.length}/${form.platform === 'google' ? 30 : 40} characters`} />
                  {form.platform === 'google' && (
                    <>
                      <TextField label="Headline 2 (required)" fullWidth value={form.headline2} onChange={(e) => update('headline2', e.target.value)} placeholder="e.g. Free 14-Day Trial" helperText={`${(form.headline2 || '').length}/30 characters`} />
                      <TextField label="Headline 3 (optional)" fullWidth value={form.headline3} onChange={(e) => update('headline3', e.target.value)} placeholder="e.g. Start Growing Today" helperText={`${(form.headline3 || '').length}/30 characters`} />
                      <TextField label="Display URL Path" fullWidth value={form.displayUrl} onChange={(e) => update('displayUrl', e.target.value)} placeholder="www.yoursite.com/offer" />
                    </>
                  )}
                  <TextField label={form.platform === 'google' ? 'Description 1' : 'Link Description'} fullWidth multiline rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your offer or product..." helperText={`${form.description.length}/${form.platform === 'google' ? 90 : 30} characters`} />
                  {form.platform === 'google' && (
                    <TextField label="Description 2 (optional)" fullWidth multiline rows={2} value={form.description2} onChange={(e) => update('description2', e.target.value)} placeholder="Additional details..." helperText={`${(form.description2 || '').length}/90 characters`} />
                  )}
                  <FormControl fullWidth>
                    <InputLabel>Call to Action</InputLabel>
                    <Select value={form.cta} label="Call to Action" onChange={(e) => update('cta', e.target.value)}>
                      {CTA_OPTIONS.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <Divider />
                  <ImageUploader images={form.images} onAdd={(img) => update('images', [...form.images, img])} onRemove={(idx) => update('images', form.images.filter((_, i) => i !== idx))} platform={form.platform} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <AdPreview platform={form.platform} form={form} />
          </Grid>
        </Grid>
      )}

      {/* Step 4: Review */}
      {activeStep === 4 && (
        <Stack spacing={3}>
          {/* Launch progress overlay */}
          {launchPhase && launchPhase !== 'error' && (
            <Card sx={{ border: '1px solid rgba(128,90,245,0.3)', bgcolor: 'rgba(128,90,245,0.04)' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                {launchPhase === 'done' ? (
                  <Stack spacing={3} sx={{ alignItems: 'stretch', textAlign: 'left', width: '100%' }}>
                    {/* Success Header */}
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                      <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(62,183,94,0.12)', border: '1px solid rgba(62,183,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconCheck size={28} color="#3EB75E" />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>Campaign Blueprint Ready</Typography>
                        <Typography variant="body2" color="text.secondary">{launchOutput?.engine === 'campaign-google' ? 'Google Ads' : 'Meta Ads'} • Score: {launchOutput?.score || 0}/100</Typography>
                      </Box>
                    </Stack>

                    {/* AI Recommendation */}
                    {launchOutput?.summary && (
                      <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(128,90,245,0.06)', border: '1px solid rgba(128,90,245,0.15)' }}>
                        <Typography sx={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{launchOutput.summary}</Typography>
                      </Box>
                    )}

                    {/* Campaign Details from engine */}
                    {launchOutput?.data?.campaign && (
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 2 }}>Campaign Overview</Typography>
                        <Grid container spacing={1.5}>
                          {Object.entries(launchOutput.data.campaign).filter(([k]) => !['status'].includes(k)).map(([k, v]) => (
                            <Grid key={k} size={{ xs: 6, md: 3 }}>
                              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</Typography>
                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>{typeof v === 'number' && k.toLowerCase().includes('budget') ? `$${v.toLocaleString()}` : Array.isArray(v) ? v.join(', ') : String(v)}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Projections */}
                    {launchOutput?.data?.projections && (
                      <Box sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(6,182,212,0.03))', border: '1px solid rgba(16,185,129,0.12)' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 2, color: '#34d399' }}>Projected Performance</Typography>
                        <Grid container spacing={1.5}>
                          {Object.entries(launchOutput.data.projections).map(([k, v]) => (
                            <Grid key={k} size={{ xs: 6, md: 3 }}>
                              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.replace(/estimated/i, '').replace(/([A-Z])/g, ' $1').trim()}</Typography>
                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399' }}>{typeof v === 'number' ? (k.includes('Rate') || k.includes('CTR') ? `${v}%` : k.includes('CPC') || k.includes('CPA') || k.includes('CPM') ? `$${v}` : k.includes('ROAS') ? `${v}x` : v.toLocaleString()) : v}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Ad Groups / Ad Sets */}
                    {(launchOutput?.data?.adGroups || launchOutput?.data?.adSets) && (
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 2 }}>{launchOutput.data.adGroups ? 'Ad Groups' : 'Ad Sets'} ({(launchOutput.data.adGroups || launchOutput.data.adSets).length})</Typography>
                        <Stack spacing={1.5}>
                          {(launchOutput.data.adGroups || launchOutput.data.adSets).map((group, i) => (
                            <Box key={i} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.035)', transform: 'translateX(4px)' }, transition: 'all 0.25s' }}>
                              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>{group.name}</Typography>
                                {group.matchType && <Chip label={group.matchType} size="small" sx={{ height: 20, fontSize: '0.58rem', fontWeight: 700, bgcolor: 'rgba(128,90,245,0.1)', color: '#a78bfa', border: '1px solid rgba(128,90,245,0.2)' }} />}
                                {group.cpcBid && <Chip label={`$${group.cpcBid} CPC`} size="small" sx={{ height: 20, fontSize: '0.58rem', fontWeight: 700, bgcolor: 'rgba(96,165,250,0.1)', color: '#60a5fa' }} />}
                              </Stack>
                              {group.keywords && (
                                <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap' }}>
                                  {group.keywords.map((kw, j) => (
                                    <Chip key={j} label={kw} size="small" sx={{ height: 22, fontSize: '0.62rem', bgcolor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.06)' }} />
                                  ))}
                                </Stack>
                              )}
                              {group.targeting && (
                                <Stack direction="row" sx={{ gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                  {group.targeting.interests?.map((int, j) => (
                                    <Chip key={j} label={int} size="small" sx={{ height: 20, fontSize: '0.58rem', bgcolor: 'rgba(251,146,60,0.06)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.12)' }} />
                                  ))}
                                </Stack>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Ads */}
                    {launchOutput?.data?.ads && (
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 2 }}>Ad Creatives ({launchOutput.data.ads.length})</Typography>
                        <Grid container spacing={2}>
                          {launchOutput.data.ads.map((ad, i) => (
                            <Grid key={i} size={{ xs: 12, md: 6 }}>
                              <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1.5 }}>
                                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>{ad.name || ad.type || `Ad ${i + 1}`}</Typography>
                                  {ad.cta && <Chip label={ad.cta} size="small" sx={{ height: 22, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(128,90,245,0.12)', color: '#a5b4fc', border: '1px solid rgba(128,90,245,0.2)' }} />}
                                </Stack>
                                {/* AI Image */}
                                {ad.imageUrl && (
                                  <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1.5, aspectRatio: '1.91 / 1', bgcolor: 'rgba(0,0,0,0.3)' }}>
                                    <Box component="img" src={ad.imageUrl} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </Box>
                                )}
                                {/* Headlines */}
                                {ad.headlines && (
                                  <Stack spacing={0.5} sx={{ mb: 1 }}>
                                    {ad.headlines.slice(0, 3).map((h, j) => (
                                      <Typography key={j} sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>{h}</Typography>
                                    ))}
                                  </Stack>
                                )}
                                {ad.headline && <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)', mb: 0.5 }}>{ad.headline}</Typography>}
                                {ad.primaryText && <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, mb: 1 }}>{ad.primaryText}</Typography>}
                                {/* Descriptions */}
                                {ad.descriptions && ad.descriptions.map((d, j) => (
                                  <Typography key={j} sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{d}</Typography>
                                ))}
                                {ad.description && <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{ad.description}</Typography>}
                                {ad.videoScript && (
                                  <Box sx={{ mt: 1, p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', mb: 0.5 }}>Video Script</Typography>
                                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{ad.videoScript}</Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Recommendations */}
                    {launchOutput?.data?.recommendations && (
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#fbbf24', mb: 1.5 }}>AI Recommendations</Typography>
                        <Stack spacing={1}>
                          {launchOutput.data.recommendations.map((rec, i) => (
                            <Stack key={i} direction="row" sx={{ gap: 1.25, alignItems: 'flex-start' }}>
                              <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '2px' }}>
                                <Typography sx={{ fontSize: '0.58rem', fontWeight: 900, color: '#fbbf24' }}>{i + 1}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{rec}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* AI Ad Copy (enrichment) */}
                    {launchOutput?.data?.aiAdCopy && (
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(192,132,252,0.04)', border: '1px solid rgba(192,132,252,0.1)', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, #c084fc, #a855f7)', borderRadius: '3px 0 0 3px' } }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#c084fc', mb: 1.5 }}>AI-Generated Ad Copy</Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{launchOutput.data.aiAdCopy}</Typography>
                      </Box>
                    )}

                    {/* Market Research (enrichment) */}
                    {launchOutput?.data?.marketResearch && (
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, #60a5fa, #3b82f6)', borderRadius: '3px 0 0 3px' } }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#60a5fa', mb: 1.5 }}>Market Intelligence</Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{typeof launchOutput.data.marketResearch === 'string' ? launchOutput.data.marketResearch : JSON.stringify(launchOutput.data.marketResearch, null, 2)}</Typography>
                      </Box>
                    )}

                    <Button variant="contained" onClick={onCancel} sx={{ mt: 1, alignSelf: 'center', px: 4 }}>View All Campaigns</Button>
                  </Stack>
                ) : (
                  <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <CircularProgress size={40} sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{launchStatus}</Typography>
                    <Box sx={{ width: '100%', maxWidth: 400 }}>
                      <LinearProgress variant="determinate" value={launchProgress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { borderRadius: 3, background: 'linear-gradient(90deg, #1BA2DB, #805AF5)' } }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>{Math.round(launchProgress)}%</Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          )}

          {launchPhase === 'error' && (
            <Alert severity="error" onClose={() => { setLaunchPhase(null); setLaunchError(null); }} sx={{ borderRadius: 2 }}>{launchError}</Alert>
          )}

          {!launchPhase && (
            <Alert severity="info" icon={<IconRocket size={20} />}>
              Review your campaign settings. Once launched, your campaign will be submitted for platform review and typically goes live within 24 hours.
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={2.5}>
                {/* Campaign */}
                <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 2 }}>
                      <img src={form.platform === 'google' ? '/images/icons/marketing-strategy-3d.png' : '/images/icons/facebook-3d.png'} alt="" width={40} height={40} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{form.name || 'Untitled Campaign'}</Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip label={form.platform === 'google' ? 'Google Ads' : 'Meta Ads'} size="small" color="primary" variant="outlined" />
                          <Chip label={objectives.find((o) => o.value === form.objective)?.label || form.objective} size="small" />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Budget & Schedule */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Card sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">{form.budgetType === 'daily' ? 'Daily Budget' : 'Lifetime Budget'}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>${form.budget.toLocaleString()}</Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Card sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Est. Monthly</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>${(form.budgetType === 'daily' ? form.budget * 30 : form.budget).toLocaleString()}</Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Card sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Start</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{form.startDate || 'Immediately'}</Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Card sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Images</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{form.images.length}</Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Audience */}
                <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Audience</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.disabled">Locations</Typography>
                        <Typography variant="body2">{form.locations || 'All locations'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <Typography variant="caption" color="text.disabled">Age</Typography>
                        <Typography variant="body2">{form.ageRange[0]}–{form.ageRange[1]}{form.ageRange[1] === 65 ? '+' : ''}</Typography>
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <Typography variant="caption" color="text.disabled">Gender</Typography>
                        <Typography variant="body2">{form.gender}</Typography>
                      </Grid>
                    </Grid>
                    {form.interests && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.disabled">Interests</Typography>
                        <Typography variant="body2">{form.interests}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Creative */}
                <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Ad Creative</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{form.headline}{form.headline2 ? ` | ${form.headline2}` : ''}</Typography>
                    {form.primaryText && <Typography variant="body2" sx={{ mt: 0.5 }}>{form.primaryText}</Typography>}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{form.description || 'No description'}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Chip label={form.cta} size="small" color="primary" />
                      {form.landingUrl && <Chip label={form.landingUrl} size="small" variant="outlined" />}
                    </Stack>
                    {form.images.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {form.images.map((img, i) => (
                          <Box key={i} sx={{ width: 80, height: 80, borderRadius: 1.5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <AdPreview platform={form.platform} form={form} />
            </Grid>
          </Grid>
        </Stack>
      )}

      {/* Navigation */}
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Button onClick={() => activeStep === 0 ? onCancel() : setActiveStep((s) => s - 1)} startIcon={<IconArrowLeft size={16} />} variant="outlined" sx={{ px: 3 }}>
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {activeStep < STEPS.length - 1 ? (
          <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)} disabled={!canNext()} endIcon={<IconArrowRight size={16} />} sx={{ px: 4 }}>
            Next Step
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleLaunch} disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconRocket size={18} />} sx={{ px: 4 }}>
            {saving ? 'Launching...' : 'Launch Campaign'}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

/***************************  CAMPAIGNS PAGE  ***************************/

export default function CampaignsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [creating, setCreating] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real campaigns + accounts on mount
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [campaignsRes, accountsRes] = await Promise.allSettled([
          fetchCampaigns({ userId: user.id }),
          fetchConnectedAccounts({ userId: user.id })
        ]);
        if (!cancelled) {
          const cData = campaignsRes.status === 'fulfilled' ? campaignsRes.value : null;
          setCampaigns(Array.isArray(cData) ? cData : cData?.campaigns || []);
          const aData = accountsRes.status === 'fulfilled' ? accountsRes.value : null;
          setAccounts(Array.isArray(aData) ? aData : aData?.accounts || []);
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, search, platformFilter, statusFilter]);

  const totalSpend = campaigns.reduce((s, c) => s + (c.spend || 0), 0);
  const totalResults = campaigns.reduce((s, c) => s + (c.results || 0), 0);
  const totalBudget = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  // Full-page builder mode
  if (creating) {
    return (
      <CampaignBuilder
        accounts={accounts}
        onSave={(campaign) => { setCampaigns((prev) => [campaign, ...prev]); setCreating(false); }}
        onCancel={() => setCreating(false)}
      />
    );
  }

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {/* Header */}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">
            Create, manage, and optimize your advertising campaigns across Meta and Google.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => setCreating(true)} sx={{ px: 3, height: 44 }}>
          New Campaign
        </Button>
      </Stack>

      {/* Stats */}
      {campaigns.length > 0 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary">Total Campaigns</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{campaigns.length}</Typography>
                <Typography variant="caption" color="text.disabled">{activeCount} active</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary">Total Budget</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>${totalBudget.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary">Total Spend</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>${totalSpend.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary">Total Results</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalResults.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        <TextField placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ minWidth: 280 }} slotProps={{ input: { startAdornment: (<InputAdornment position="start"><IconSearch size={18} /></InputAdornment>) } }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Platform</InputLabel>
          <Select value={platformFilter} label="Platform" onChange={(e) => setPlatformFilter(e.target.value)}>
            <MenuItem value="all">All Platforms</MenuItem>
            <MenuItem value="google">Google Ads</MenuItem>
            <MenuItem value="meta">Meta Ads</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="paused">Paused</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="review">In Review</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Empty State or Table */}
      {campaigns.length === 0 ? (
        <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <img src="/images/icons/promotion-3d.png" alt="" width={96} height={96} style={{ objectFit: 'contain', opacity: 0.6 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>Create your first campaign</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}>
              Launch advertising campaigns on Meta and Google. Set your objective, define your audience, create compelling ads, and start driving results.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button variant="contained" size="large" startIcon={<IconPlus size={20} />} onClick={() => setCreating(true)} sx={{ px: 4 }}>
                Create Campaign
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Budget</TableCell>
                  <TableCell align="right">Spend</TableCell>
                  <TableCell align="right">Results</TableCell>
                  <TableCell align="right">CPA</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((c) => {
                    const st = STATUS_MAP[c.status] || STATUS_MAP.draft;
                    return (
                      <TableRow key={c.id} hover>
                        <TableCell>
                          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                            <img src={c.image} alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
                            <Box>
                              <Typography variant="subtitle2">{c.name}</Typography>
                              <Typography variant="caption" color="text.disabled">{c.objective}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{c.platform === 'google' ? 'Google Ads' : 'Meta Ads'}</TableCell>
                        <TableCell><Chip label={st.label} size="small" color={st.color} /></TableCell>
                        <TableCell align="right">${(c.budget || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">${(c.spend || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">{(c.results || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">{c.cpa > 0 ? `$${c.cpa.toFixed(2)}` : '—'}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                            <Tooltip title="View"><IconButton size="small"><IconEye size={16} /></IconButton></Tooltip>
                            <Tooltip title={c.status === 'active' ? 'Pause' : 'Activate'}><IconButton size="small">{c.status === 'active' ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}</IconButton></Tooltip>
                            <Tooltip title="Duplicate"><IconButton size="small"><IconCopy size={16} /></IconButton></Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body2" color="text.secondary">No campaigns match your filters.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Stack>
  );
}
