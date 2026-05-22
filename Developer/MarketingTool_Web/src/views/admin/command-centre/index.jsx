import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

// @assets
import {
  IconRocket, IconSettings, IconTrendingUp, IconArrowRight, IconArrowLeft,
  IconPlayerPlay, IconCheck, IconAlertTriangle, IconClipboard, IconRefresh,
  IconDownload, IconBolt, IconShieldCheck
} from '@tabler/icons-react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import { startWorkflowRun, getRunStatus, fetchConnectedAccounts } from '@/utils/api/windmill';
import { WORKFLOWS, PLATFORM_CONFIG } from './workflows';
import WorkflowOutput from './WorkflowOutputs';

/***************************  GLASS TOKENS  ***************************/

const glass = {
  bg: 'rgba(10, 10, 14, 0.80)',
  border: '1px solid rgba(255,255,255,0.03)',
  blur: 'blur(40px)',
  shadow: 'inset 2px 4px 16px 0px rgba(0,0,0,0.25)',
  radius: '24px',
  hoverBorder: 'rgba(255,255,255,0.07)',
  cardBg: 'rgba(30, 30, 35, 0.65)',
  cardBorder: '1px solid rgba(255,255,255,0.06)',
  cardShadow: 'inset 2px 4px 16px 0px rgba(248,248,248,0.03)',
  surface: 'rgba(255,255,255,0.03)',
  inputBg: 'rgba(255,255,255,0.03)',
  inputBorder: 'rgba(255,255,255,0.1)',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    background: glass.inputBg,
    '& fieldset': { borderColor: glass.inputBorder },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  },
};


/***************************  SECTION CONFIG  ***************************/

const SECTIONS = [
  { key: 'launch', title: 'Launch', subtitle: 'Build and launch new campaigns', icon: IconRocket, cols: { xs: 12, md: 6 }, large: true },
  { key: 'optimise', title: 'Optimise', subtitle: 'Improve what\u2019s already running', icon: IconSettings, cols: { xs: 12, sm: 6, md: 3 }, large: false },
  { key: 'scale', title: 'Scale', subtitle: 'Grow your best performers', icon: IconTrendingUp, cols: { xs: 12, sm: 6, md: 3 }, large: false },
];

/***************************  WORKFLOW CARD  ***************************/

function WorkflowCard({ workflow, large, accounts, onClick, index }) {
  const platformConf = PLATFORM_CONFIG[workflow.platform] || PLATFORM_CONFIG.both;
  const hasAccount = (accounts || []).some((acc) => workflow.platform === 'both' || acc.platform === workflow.platform);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }} style={{ height: '100%' }}>
      <Box
        onClick={onClick}
        sx={{
          height: '100%', background: glass.cardBg, backdropFilter: glass.blur, WebkitBackdropFilter: glass.blur,
          border: glass.cardBorder, boxShadow: glass.cardShadow, borderRadius: glass.radius, overflow: 'hidden',
          cursor: 'pointer', transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
          '&:hover': { borderColor: glass.hoverBorder, transform: 'translateY(-3px)', boxShadow: `${glass.cardShadow}, 0 8px 32px rgba(128, 90, 245, 0.12)` },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: large ? 3.5 : 2.5 }}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ width: large ? 56 : 44, height: large ? 56 : 44 }}>
              <img src={workflow.iconImage} alt={workflow.title} width={large ? 56 : 44} height={large ? 56 : 44} style={{ objectFit: 'contain' }} />
            </Box>
            <Chip label={platformConf.label} size="small" sx={{ height: 22, fontSize: 10.5, fontWeight: 700, bgcolor: `${platformConf.color}14`, color: platformConf.color, border: `1px solid ${platformConf.color}25` }} />
          </Stack>
          <Typography variant={large ? 'h5' : 'h6'} sx={{ fontWeight: 700, mb: 0.75 }}>{workflow.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flex: 1, lineHeight: 1.6, fontSize: 13.5 }}>{workflow.description}</Typography>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: hasAccount ? 'success.main' : 'error.main', boxShadow: hasAccount ? '0 0 8px rgba(62,183,94,0.5)' : '0 0 8px rgba(255,0,3,0.4)' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>{hasAccount ? 'Account connected' : 'No account'}</Typography>
            </Stack>
            <Button size="small" endIcon={<IconArrowRight size={14} />} sx={{ fontWeight: 700, color: 'primary.main', fontSize: 13, textTransform: 'none', minWidth: 0, px: 1 }}>
              Run
            </Button>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
}

/***************************  FULL-PAGE WORKFLOW EXECUTION VIEW  ***************************/

function WorkflowExecutionView({ workflow, accounts, onBack }) {
  const { user } = useAuth();
  const platformConf = PLATFORM_CONFIG[workflow.platform] || PLATFORM_CONFIG.both;

  const [formData, setFormData] = useState({});
  const [phase, setPhase] = useState('input'); // input | running | completed | error
  const [runId, setRunId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const pollRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const defaults = {};
    workflow.inputSchema.forEach((f) => { if (f.default !== undefined) defaults[f.key] = f.default; });
    setFormData(defaults);
  }, [workflow.id]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const handleFieldChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const filteredAccounts = (accounts || []).filter((acc) => workflow.platform === 'both' || acc.platform === workflow.platform);

  const handleRun = async () => {
    const isDryRun = formData.dry_run !== false;
    const missing = workflow.inputSchema.filter((f) => f.required && !formData[f.key] && formData[f.key] !== 0 && formData[f.key] !== false && !(isDryRun && f.type === 'account_select'));
    if (missing.length > 0) { setError(`Required: ${missing.map((f) => f.label).join(', ')}`); return; }

    setPhase('running'); setError(null); setProgress(0); setStatusText('Queuing workflow...'); startTimeRef.current = Date.now();
    try {
      const response = await startWorkflowRun({ workflowId: workflow.id, inputs: formData, userId: user?.id || 'anonymous' });
      const rid = response?.run_id || response?.job_id;
      if (!rid) {
        if (response?.output || response?.summary || response?.actions) { setOutput(response?.output || response); setPhase('completed'); return; }
        throw new Error('No run ID returned');
      }
      setRunId(rid); setStatusText('Running...'); setProgress(10);

      pollRef.current = setInterval(async () => {
        try {
          const status = await getRunStatus({ runId: rid });
          const elapsed = Date.now() - startTimeRef.current;
          if (status?.status === 'completed') { clearInterval(pollRef.current); pollRef.current = null; setProgress(100); setOutput(status.output_json || status.output || status); setPhase('completed'); }
          else if (status?.status === 'failed') { clearInterval(pollRef.current); pollRef.current = null; setError(status.error || 'Workflow failed'); setPhase('error'); }
          else { setProgress(Math.min(90, 10 + (elapsed / 300000) * 80)); setStatusText(status?.status === 'running' ? 'Processing...' : 'Queued...'); }
          if (elapsed > 300000) { clearInterval(pollRef.current); pollRef.current = null; setError('Timed out after 5 minutes.'); setPhase('error'); }
        } catch { /* skip tick */ }
      }, 2500);
    } catch (err) { setError(err.message || 'Failed to start workflow'); setPhase('error'); }
  };

  const handleReset = () => { if (pollRef.current) clearInterval(pollRef.current); setPhase('input'); setRunId(null); setProgress(0); setOutput(null); setError(null); };

  const handleCopy = () => {
    navigator.clipboard.writeText(typeof output === 'string' ? output : JSON.stringify(output, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${workflow.id}-result.json`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── RENDER FORM FIELD ──
  const renderField = (field) => {
    if (field.type === 'boolean') {
      return (
        <FormControlLabel key={field.key}
          control={<Switch checked={formData[field.key] ?? field.default ?? false} onChange={(e) => handleFieldChange(field.key, e.target.checked)} size="small" />}
          label={<Typography variant="body2" color="text.secondary">{field.label}</Typography>}
        />
      );
    }
    if (field.type === 'account_select') {
      return (
        <Box key={field.key}>
          <InputLabel sx={{ mb: 0.5, color: 'text.secondary', fontSize: 13 }}>{field.label} {field.required && <span style={{ color: '#FF0003' }}>*</span>}</InputLabel>
          <FormControl fullWidth>
            <Select value={formData[field.key] || ''} onChange={(e) => handleFieldChange(field.key, e.target.value)} displayEmpty size="small" sx={fieldSx}>
              <MenuItem value="" disabled>{filteredAccounts.length === 0 ? 'No accounts connected' : 'Select account...'}</MenuItem>
              {filteredAccounts.map((acc) => <MenuItem key={acc.id || acc.account_id} value={acc.id || acc.account_id}>{acc.name || acc.account_name || acc.id}</MenuItem>)}
            </Select>
          </FormControl>
          {filteredAccounts.length === 0 && <Typography variant="caption" sx={{ mt: 0.5, color: 'warning.main', display: 'block' }}>Connect an ad account via Settings</Typography>}
        </Box>
      );
    }
    if (field.type === 'select') {
      return (
        <Box key={field.key}>
          <InputLabel sx={{ mb: 0.5, color: 'text.secondary', fontSize: 13 }}>{field.label} {field.required && <span style={{ color: '#FF0003' }}>*</span>}</InputLabel>
          <FormControl fullWidth>
            <Select value={formData[field.key] || ''} onChange={(e) => handleFieldChange(field.key, e.target.value)} displayEmpty size="small" sx={fieldSx}>
              <MenuItem value="" disabled>Select...</MenuItem>
              {(field.options || []).map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      );
    }
    return (
      <Box key={field.key}>
        <InputLabel sx={{ mb: 0.5, color: 'text.secondary', fontSize: 13 }}>{field.label} {field.required && <span style={{ color: '#FF0003' }}>*</span>}</InputLabel>
        <TextField type={field.type === 'number' ? 'number' : 'text'} placeholder={field.placeholder || ''} value={formData[field.key] ?? (field.default !== undefined ? field.default : '')} onChange={(e) => handleFieldChange(field.key, e.target.value)} fullWidth size="small" sx={fieldSx} />
      </Box>
    );
  };

  // Split fields into two columns for wide screens
  const nonBooleanFields = workflow.inputSchema.filter((f) => f.type !== 'boolean');
  const booleanFields = workflow.inputSchema.filter((f) => f.type === 'boolean');

  const phaseColor = phase === 'completed' ? '#3EB75E' : phase === 'running' ? '#1BA2DB' : phase === 'error' ? '#FF4757' : '#805AF5';

  return (
    <Stack sx={{ gap: 3 }}>
      {/* Back + Status Bar */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Button startIcon={<IconArrowLeft size={18} />} onClick={onBack} color="inherit" sx={{ fontWeight: 600 }}>
          Back to Command Centre
        </Button>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          {filteredAccounts.length > 0 && (
            <Chip icon={<IconShieldCheck size={13} />} label={`${filteredAccounts.length} account${filteredAccounts.length > 1 ? 's' : ''}`} size="small" sx={{ bgcolor: 'rgba(62,183,94,0.1)', color: '#3EB75E', fontWeight: 600, fontSize: 11, '& .MuiChip-icon': { color: '#3EB75E' } }} />
          )}
          {formData.dry_run !== false && (
            <Chip label="DRY RUN" size="small" sx={{ bgcolor: 'rgba(255,200,118,0.1)', color: 'warning.main', fontWeight: 700, fontSize: 10, letterSpacing: 0.5 }} />
          )}
          <Chip
            label={phase === 'input' ? 'Ready' : phase === 'running' ? 'Running...' : phase === 'completed' ? 'Completed' : 'Error'}
            size="small"
            sx={{
              fontWeight: 600, fontSize: 11,
              bgcolor: `${phaseColor}15`,
              color: phaseColor,
            }}
          />
        </Stack>
      </Stack>

      {/* Hero Header — Full Width */}
      <Box sx={{ background: glass.bg, backdropFilter: glass.blur, WebkitBackdropFilter: glass.blur, border: glass.border, boxShadow: glass.shadow, borderRadius: glass.radius, p: 4, overflow: 'hidden', position: 'relative' }}>
        {/* Accent line */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: `linear-gradient(90deg, ${platformConf.color}, ${platformConf.color}00)` }} />
        <Stack direction="row" sx={{ alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: 3, bgcolor: glass.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={workflow.iconImage} alt={workflow.title} width={48} height={48} style={{ objectFit: 'contain' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{workflow.title}</Typography>
              <Chip label={platformConf.label} size="small" sx={{ bgcolor: `${platformConf.color}20`, color: platformConf.color, border: `1px solid ${platformConf.color}30`, fontWeight: 600, fontSize: 11 }} />
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14.5, lineHeight: 1.6 }}>{workflow.description}</Typography>
          </Box>
          {/* Quick stats */}
          <Stack direction="row" sx={{ gap: 3, flexShrink: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Fields</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>{workflow.inputSchema.length}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Engine</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: platformConf.color }}>{workflow.section === 'launch' ? 'Launch' : workflow.section === 'optimise' ? 'Opt' : 'Scale'}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content — Full Width */}
      <Box sx={{ background: glass.bg, backdropFilter: glass.blur, WebkitBackdropFilter: glass.blur, border: glass.border, boxShadow: glass.shadow, borderRadius: glass.radius, p: 4, overflow: 'hidden' }}>
        {/* Form Section — 2 Column Layout at 1920px */}
        {(phase === 'input' || phase === 'error') && (
          <Stack sx={{ gap: 3.5 }}>
            <Box>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
                <IconPlayerPlay size={20} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Configure Workflow</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">Fill in the details below and click Run to execute this workflow</Typography>
            </Box>

            {/* 2-column grid for form fields on wide screens */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5, maxWidth: 1200 }}>
              {nonBooleanFields.map(renderField)}
            </Box>

            {/* Boolean toggles in a row */}
            {booleanFields.length > 0 && (
              <Stack direction="row" sx={{ gap: 3, flexWrap: 'wrap' }}>
                {booleanFields.map(renderField)}
              </Stack>
            )}

            {error && <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
              <Button variant="contained" size="large" onClick={handleRun} startIcon={<IconBolt size={18} />}
                sx={{ borderRadius: 2, py: 1.5, px: 5, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #805AF5 0%, #6B3FD4 100%)', boxShadow: '0 4px 20px rgba(128, 90, 245, 0.3)', '&:hover': { background: 'linear-gradient(135deg, #9B7BF7 0%, #805AF5 100%)' } }}>
                Run Workflow
              </Button>
              {formData.dry_run !== false && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Preview mode — no live changes</Typography>
              )}
            </Stack>
          </Stack>
        )}

        {/* Running State */}
        {phase === 'running' && (
          <Stack spacing={4} sx={{ alignItems: 'center', py: 8, maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ position: 'relative', width: 90, height: 90 }}>
              <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #1BA2DB', animation: 'pulse-ring 1.5s ease-out infinite', '@keyframes pulse-ring': { '0%': { transform: 'scale(0.8)', opacity: 1 }, '100%': { transform: 'scale(1.6)', opacity: 0 } } }} />
              <Box sx={{ position: 'absolute', inset: 12, borderRadius: '50%', bgcolor: 'rgba(27,162,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={30} sx={{ color: '#1BA2DB' }} />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{statusText}</Typography>
              <Typography variant="body2" color="text.secondary">This may take up to 2 minutes depending on data volume</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { borderRadius: 4, background: 'linear-gradient(90deg, #1BA2DB, #805AF5)' } }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block', textAlign: 'center', fontSize: 12 }}>{Math.round(progress)}%</Typography>
            </Box>
            {formData.dry_run !== false && <Chip label="DRY RUN — no changes will be applied" size="small" sx={{ bgcolor: 'rgba(255,200,118,0.12)', color: 'warning.main', fontWeight: 600, fontSize: 11 }} />}
          </Stack>
        )}

        {/* Completed Output — Full Width, Rich Layout */}
        {phase === 'completed' && output && (
          <Stack spacing={3.5}>
            {/* Result Toolbar */}
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                <Chip icon={<IconCheck size={14} />} label={formData.dry_run !== false ? 'Dry Run Complete' : 'Workflow Complete'} size="small"
                  sx={{ bgcolor: formData.dry_run !== false ? 'rgba(255,200,118,0.12)' : 'rgba(62,183,94,0.12)', color: formData.dry_run !== false ? 'warning.main' : 'success.main', fontWeight: 600, fontSize: 12, height: 28, '& .MuiChip-icon': { color: 'inherit' } }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {workflow.title} — {new Date().toLocaleString()}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={handleCopy} title="Copy to clipboard" sx={{ bgcolor: glass.surface, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  <IconClipboard size={16} />
                </IconButton>
                <IconButton size="small" onClick={handleExportJSON} title="Export JSON" sx={{ bgcolor: glass.surface, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  <IconDownload size={16} />
                </IconButton>
                <IconButton size="small" onClick={handleReset} title="Run again" sx={{ bgcolor: glass.surface, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  <IconRefresh size={16} />
                </IconButton>
              </Stack>
            </Stack>
            {copied && <Alert severity="success" sx={{ borderRadius: 2, py: 0 }}>Copied to clipboard</Alert>}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />

            {/* Workflow-Specific Rich Output — Full Width */}
            <WorkflowOutput workflowId={workflow.id} output={output} formData={formData} />

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />

            {/* Bottom Actions */}
            <Stack direction="row" sx={{ gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<IconRefresh size={16} />} sx={{ borderRadius: 2, borderColor: glass.inputBorder, color: 'text.secondary' }}>
                Run Again
              </Button>
              <Button variant="text" onClick={onBack} startIcon={<IconArrowLeft size={16} />} sx={{ color: 'text.secondary' }}>
                Back to Command Centre
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

/***************************  COMMAND CENTRE PAGE  ***************************/

export default function CommandCentrePage() {
  const { user } = useAuth();

  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetchConnectedAccounts({ userId: user.id });
        if (!cancelled) setAccounts(Array.isArray(res) ? res : res?.accounts || []);
      } catch { /* silent */ }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  // FULL PAGE workflow execution view
  if (selectedWorkflow) {
    return (
      <WorkflowExecutionView
        workflow={selectedWorkflow}
        accounts={accounts}
        onBack={() => setSelectedWorkflow(null)}
      />
    );
  }

  // DEFAULT: Cards grid
  let cardIndex = 0;
  return (
    <Stack sx={{ gap: { xs: 4, md: 5 } }}>
      {/* Page Header */}
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>Command Centre</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: 15 }}>Launch, optimise, and scale your ad campaigns with AI-powered workflows</Typography>
      </Box>

      {SECTIONS.map((section) => {
        const SectionIcon = section.icon;
        const sectionWorkflows = WORKFLOWS.filter((w) => w.section === section.key);
        return (
          <Box key={section.key}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: glass.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SectionIcon size={18} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{section.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{section.subtitle}</Typography>
              </Box>
            </Stack>
            <Grid container spacing={section.large ? 2.5 : 2} sx={{ mt: 1.5 }}>
              {sectionWorkflows.map((workflow) => {
                const idx = cardIndex++;
                return (
                  <Grid key={workflow.id} size={section.cols}>
                    <WorkflowCard workflow={workflow} large={section.large} accounts={accounts} onClick={() => setSelectedWorkflow(workflow)} index={idx} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Stack>
  );
}
