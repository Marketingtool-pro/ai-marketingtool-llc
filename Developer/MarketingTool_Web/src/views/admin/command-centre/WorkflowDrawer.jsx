import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// @mui
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

// @assets
import {
  IconX,
  IconPlayerPlay,
  IconCheck,
  IconAlertTriangle,
  IconDownload,
  IconArrowDown,
  IconPlayerPause,
  IconRefresh,
  IconFileSpreadsheet,
  IconExternalLink,
  IconClipboard
} from '@tabler/icons-react';

// @project
import { startWorkflowRun, getRunStatus } from '@/utils/api/windmill';
import { useAuth } from '@/contexts/AuthContext';
import { PLATFORM_CONFIG } from './workflows';

/***************************  CONSTANTS  ***************************/

const DRAWER_WIDTH = 560;
const POLL_INTERVAL = 2500;
const MAX_POLL_TIME = 300000; // 5 min

const glass = {
  bg: 'rgba(14, 12, 21, 0.97)',
  surface: 'rgba(255,255,255,0.03)',
  surfaceHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.06)',
  inputBg: 'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.10)',
  inputHover: 'rgba(255,255,255,0.18)',
};

const PHASE_COLORS = {
  input: '#805AF5',
  running: '#1BA2DB',
  completed: '#3EB75E',
  error: '#FF0003',
};

// Action type → icon + color
const ACTION_ICONS = {
  pause_keyword: { icon: IconPlayerPause, color: '#FFC876', label: 'Pause' },
  lower_bid: { icon: IconArrowDown, color: '#1BA2DB', label: 'Lower Bid' },
  raise_bid: { icon: IconArrowDown, color: '#3EB75E', label: 'Raise Bid', rotate: true },
  pause_ad: { icon: IconPlayerPause, color: '#FFC876', label: 'Pause Ad' },
  enable_ad: { icon: IconPlayerPlay, color: '#3EB75E', label: 'Enable' },
  create: { icon: IconPlayerPlay, color: '#805AF5', label: 'Create' },
  update: { icon: IconRefresh, color: '#1BA2DB', label: 'Update' },
};

/***************************  FIELD STYLES  ***************************/

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    background: glass.inputBg,
    '& fieldset': { borderColor: glass.inputBorder },
    '&:hover fieldset': { borderColor: glass.inputHover },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  },
};

/***************************  WORKFLOW DRAWER  ***************************/

export default function WorkflowDrawer({ open, onClose, workflow, accounts }) {
  const { user } = useAuth();

  // Phase: input → running → completed → error
  const [phase, setPhase] = useState('input');
  const [formData, setFormData] = useState({});
  const [runId, setRunId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const pollRef = useRef(null);
  const startTimeRef = useRef(null);

  // Initialize form defaults when workflow changes
  useEffect(() => {
    if (workflow) {
      const defaults = {};
      workflow.inputSchema.forEach((field) => {
        if (field.default !== undefined) defaults[field.key] = field.default;
      });
      setFormData(defaults);
      setPhase('input');
      setRunId(null);
      setProgress(0);
      setOutput(null);
      setError(null);
    }
  }, [workflow?.id]);

  // Cleanup polling on unmount / close
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleClose = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    onClose();
  };

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── RUN WORKFLOW ──────────────────────────────────────
  const handleRun = async () => {
    // Validate required fields
    const missing = workflow.inputSchema.filter(
      (f) => f.required && !formData[f.key] && formData[f.key] !== 0 && formData[f.key] !== false
    );
    if (missing.length > 0) {
      setError(`Required: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }

    setPhase('running');
    setError(null);
    setProgress(0);
    setStatusText('Queuing workflow...');
    startTimeRef.current = Date.now();

    try {
      const response = await startWorkflowRun({
        workflowId: workflow.id,
        inputs: formData,
        userId: user?.id || 'anonymous',
      });

      const rid = response?.run_id || response?.job_id;
      if (!rid) {
        // If response has output directly (sync execution)
        if (response?.output || response?.summary || response?.actions) {
          setOutput(response?.output || response);
          setPhase('completed');
          return;
        }
        throw new Error('No run ID returned from server');
      }

      setRunId(rid);
      setStatusText('Running...');
      setProgress(10);

      // Start polling
      pollRef.current = setInterval(async () => {
        try {
          const status = await getRunStatus({ runId: rid });
          const elapsed = Date.now() - startTimeRef.current;

          if (status?.status === 'completed') {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setProgress(100);
            setStatusText('Completed');
            setOutput(status.output_json || status.output || status);
            setPhase('completed');
          } else if (status?.status === 'failed') {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setError(status.error || 'Workflow failed');
            setPhase('error');
          } else {
            // Update progress based on elapsed time (smooth ramp to 90%)
            const pct = Math.min(90, 10 + (elapsed / MAX_POLL_TIME) * 80);
            setProgress(pct);
            setStatusText(status?.status === 'running' ? 'Processing...' : 'Queued...');
          }

          // Timeout guard
          if (elapsed > MAX_POLL_TIME) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setError('Workflow timed out after 5 minutes. It may still be running on the server.');
            setPhase('error');
          }
        } catch {
          // Polling error — don't kill it, just skip this tick
        }
      }, POLL_INTERVAL);
    } catch (err) {
      setError(err.message || 'Failed to start workflow');
      setPhase('error');
    }
  };

  // ── RESET ──────────────────────────────────────────────
  const handleReset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setPhase('input');
    setRunId(null);
    setProgress(0);
    setOutput(null);
    setError(null);
  };

  // ── COPY OUTPUT ────────────────────────────────────────
  const handleCopy = () => {
    const text = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!workflow) return null;

  const platformConf = PLATFORM_CONFIG[workflow.platform] || PLATFORM_CONFIG.both;
  const phaseColor = PHASE_COLORS[phase] || PHASE_COLORS.input;

  // Filter accounts by workflow platform
  const filteredAccounts = (accounts || []).filter((acc) => {
    if (workflow.platform === 'both') return true;
    return acc.platform === workflow.platform;
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: DRAWER_WIDTH,
          maxWidth: '100vw',
          background: glass.bg,
          borderLeft: `1px solid ${glass.border}`,
          overflow: 'hidden',
        },
      }}
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' } } }}
    >
      {/* ── Accent bar ── */}
      <Box
        sx={{
          height: 3,
          background: phase === 'running'
            ? `linear-gradient(90deg, ${phaseColor}, #805AF5, ${phaseColor})`
            : phaseColor,
          backgroundSize: phase === 'running' ? '200% 100%' : 'auto',
          animation: phase === 'running' ? 'shimmer 2s ease infinite' : 'none',
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        }}
      />

      {/* ── Header ── */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${glass.border}` }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 2, flex: 1 }}>
            <Box sx={{ width: 44, height: 44, flexShrink: 0 }}>
              <img src={workflow.iconImage} alt="" width={44} height={44} style={{ objectFit: 'contain' }} />
            </Box>
            <Box>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.25 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {workflow.title}
                </Typography>
                <Chip
                  label={platformConf.label}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: `${platformConf.color}20`,
                    color: platformConf.color,
                    border: `1px solid ${platformConf.color}30`,
                  }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {workflow.description}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} size="small" sx={{ mt: 0.5 }}>
            <IconX size={18} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Content ── */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5 }}>
        <AnimatePresence mode="wait">
          {/* ════════  INPUT PHASE  ════════ */}
          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Stack spacing={2.5}>
                {workflow.inputSchema.map((field) => {
                  if (field.type === 'boolean') {
                    return (
                      <FormControlLabel
                        key={field.key}
                        control={
                          <Switch
                            checked={formData[field.key] ?? field.default ?? false}
                            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.secondary">
                            {field.label}
                          </Typography>
                        }
                      />
                    );
                  }

                  if (field.type === 'account_select') {
                    return (
                      <Box key={field.key}>
                        <InputLabel sx={{ mb: 0.75, color: 'text.secondary', fontSize: 13 }}>
                          {field.label} {field.required && <span style={{ color: '#FF0003' }}>*</span>}
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            value={formData[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            displayEmpty
                            size="small"
                            sx={fieldSx}
                          >
                            <MenuItem value="" disabled>
                              {filteredAccounts.length === 0 ? 'No accounts connected' : 'Select account...'}
                            </MenuItem>
                            {filteredAccounts.map((acc) => (
                              <MenuItem key={acc.id || acc.account_id} value={acc.id || acc.account_id}>
                                {acc.name || acc.account_name || acc.id || acc.account_id}
                                {acc.platform && (
                                  <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.5 }}>
                                    ({acc.platform})
                                  </Typography>
                                )}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {filteredAccounts.length === 0 && (
                          <Typography variant="caption" sx={{ mt: 0.5, color: 'warning.main', display: 'block' }}>
                            Connect an ad account via the popup above
                          </Typography>
                        )}
                      </Box>
                    );
                  }

                  if (field.type === 'select') {
                    return (
                      <Box key={field.key}>
                        <InputLabel sx={{ mb: 0.75, color: 'text.secondary', fontSize: 13 }}>
                          {field.label} {field.required && <span style={{ color: '#FF0003' }}>*</span>}
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            value={formData[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            displayEmpty
                            size="small"
                            sx={fieldSx}
                          >
                            <MenuItem value="" disabled>Select...</MenuItem>
                            {(field.options || []).map((opt) => (
                              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    );
                  }

                  // text / number
                  return (
                    <Box key={field.key}>
                      <InputLabel sx={{ mb: 0.75, color: 'text.secondary', fontSize: 13 }}>
                        {field.label} {field.required && <span style={{ color: '#FF0003' }}>*</span>}
                      </InputLabel>
                      <TextField
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.placeholder || ''}
                        value={formData[field.key] ?? (field.default !== undefined ? field.default : '')}
                        onChange={(e) => handleFieldChange(field.key, field.type === 'number' ? e.target.value : e.target.value)}
                        fullWidth
                        size="small"
                        sx={fieldSx}
                      />
                    </Box>
                  );
                })}

                {error && (
                  <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleRun}
                  startIcon={<IconPlayerPlay size={18} />}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 15,
                    background: 'linear-gradient(135deg, #805AF5 0%, #6B3FD4 100%)',
                    boxShadow: '0 4px 20px rgba(128, 90, 245, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9B7BF7 0%, #805AF5 100%)',
                      boxShadow: '0 6px 28px rgba(128, 90, 245, 0.45)',
                    },
                  }}
                >
                  Run Workflow
                </Button>
              </Stack>
            </motion.div>
          )}

          {/* ════════  RUNNING PHASE  ════════ */}
          {phase === 'running' && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={4} sx={{ alignItems: 'center', pt: 6, pb: 4 }}>
                {/* Pulse animation */}
                <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: `2px solid ${phaseColor}`,
                      animation: 'pulse-ring 1.5s ease-out infinite',
                      '@keyframes pulse-ring': {
                        '0%': { transform: 'scale(0.8)', opacity: 1 },
                        '100%': { transform: 'scale(1.6)', opacity: 0 },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: `2px solid ${phaseColor}`,
                      animation: 'pulse-ring 1.5s ease-out 0.5s infinite',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 10,
                      borderRadius: '50%',
                      bgcolor: `${phaseColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={28} sx={{ color: phaseColor }} />
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {statusText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)}s elapsed
                  </Typography>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 320 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.06)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${phaseColor}, #805AF5)`,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                    {Math.round(progress)}%
                  </Typography>
                </Box>

                {formData.dry_run && (
                  <Chip
                    label="DRY RUN — no changes will be applied"
                    size="small"
                    sx={{ bgcolor: 'rgba(255, 200, 118, 0.12)', color: 'warning.main', fontWeight: 600 }}
                  />
                )}
              </Stack>
            </motion.div>
          )}

          {/* ════════  COMPLETED PHASE  ════════ */}
          {phase === 'completed' && output && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={3}>
                {/* Status badge */}
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip
                    icon={<IconCheck size={14} />}
                    label={formData.dry_run ? 'Dry Run Complete' : 'Completed'}
                    size="small"
                    sx={{
                      bgcolor: formData.dry_run ? 'rgba(255,200,118,0.12)' : 'rgba(62,183,94,0.12)',
                      color: formData.dry_run ? 'warning.main' : 'success.main',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'inherit' },
                    }}
                  />
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={handleCopy} title="Copy output">
                      <IconClipboard size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={handleReset} title="Run again">
                      <IconRefresh size={16} />
                    </IconButton>
                  </Stack>
                </Stack>

                {copied && (
                  <Alert severity="success" sx={{ borderRadius: 2, py: 0 }}>
                    Copied to clipboard
                  </Alert>
                )}

                {/* ── SUMMARY KPIs ── */}
                {output.summary && typeof output.summary === 'object' && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, color: 'text.secondary' }}>
                      Summary
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                      {Object.entries(output.summary).map(([key, value], i) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: glass.surface,
                              border: `1px solid ${glass.border}`,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                              {key.replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25 }}>
                              {typeof value === 'number' && key.includes('spend') || key.includes('saving') || key.includes('budget') || key.includes('cost')
                                ? `$${value.toLocaleString()}`
                                : typeof value === 'boolean'
                                  ? (value ? 'Yes' : 'No')
                                  : String(value)}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* ── ACTIONS LIST ── */}
                {Array.isArray(output.actions) && output.actions.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, color: 'text.secondary' }}>
                      Actions ({output.actions.length})
                    </Typography>
                    <Stack spacing={1}>
                      {output.actions.map((action, i) => {
                        const actionConf = ACTION_ICONS[action.type] || { icon: IconRefresh, color: '#805AF5', label: action.type };
                        const ActionIcon = actionConf.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.06 }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: glass.surface,
                                border: `1px solid ${glass.border}`,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 1.5,
                                  bgcolor: `${actionConf.color}15`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  mt: 0.25,
                                }}
                              >
                                <ActionIcon
                                  size={14}
                                  color={actionConf.color}
                                  style={actionConf.rotate ? { transform: 'rotate(180deg)' } : undefined}
                                />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.25 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13 }}>
                                    {actionConf.label}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.4, fontFamily: 'monospace', fontSize: 11 }}>
                                    {action.entity || ''} {action.id || ''}
                                  </Typography>
                                </Stack>
                                {action.reason && (
                                  <Typography variant="caption" color="text.secondary">
                                    {action.reason}
                                  </Typography>
                                )}
                                {(action.from !== undefined && action.to !== undefined) && (
                                  <Typography variant="caption" sx={{ color: actionConf.color, display: 'block', mt: 0.25 }}>
                                    ${action.from} → ${action.to}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* ── WARNINGS ── */}
                {Array.isArray(output.warnings) && output.warnings.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, color: 'text.secondary' }}>
                      Warnings
                    </Typography>
                    <Stack spacing={1}>
                      {output.warnings.map((warn, i) => (
                        <Alert key={i} severity="warning" icon={<IconAlertTriangle size={16} />} sx={{ borderRadius: 2 }}>
                          {typeof warn === 'string' ? warn : warn.message || JSON.stringify(warn)}
                        </Alert>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* ── ARTIFACTS ── */}
                {Array.isArray(output.artifacts) && output.artifacts.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, color: 'text.secondary' }}>
                      Downloads
                    </Typography>
                    <Stack spacing={1}>
                      {output.artifacts.map((artifact, i) => (
                        <Box
                          key={i}
                          component="a"
                          href={artifact.url}
                          target="_blank"
                          rel="noopener"
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: glass.surface,
                            border: `1px solid ${glass.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'background 0.2s',
                            '&:hover': { bgcolor: glass.surfaceHover },
                          }}
                        >
                          <IconFileSpreadsheet size={18} color="#3EB75E" />
                          <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                            {artifact.label || artifact.type}
                          </Typography>
                          <IconDownload size={16} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* ── RAW OUTPUT FALLBACK ── */}
                {!output.summary && !output.actions && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, color: 'text.secondary' }}>
                      Output
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: 2,
                        p: 2,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: 400,
                        overflow: 'auto',
                        border: `1px solid ${glass.border}`,
                        color: 'text.primary',
                      }}
                    >
                      {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ opacity: 0.3 }} />

                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<IconRefresh size={16} />}
                  sx={{ borderRadius: 2, borderColor: glass.inputBorder, color: 'text.secondary' }}
                >
                  Run Again
                </Button>
              </Stack>
            </motion.div>
          )}

          {/* ════════  ERROR PHASE  ════════ */}
          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={3} sx={{ pt: 4 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error || 'An unexpected error occurred'}
                </Alert>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    startIcon={<IconRefresh size={16} />}
                    sx={{ borderRadius: 2, flex: 1 }}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ borderRadius: 2, borderColor: glass.inputBorder, color: 'text.secondary' }}
                  >
                    Close
                  </Button>
                </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Drawer>
  );
}
