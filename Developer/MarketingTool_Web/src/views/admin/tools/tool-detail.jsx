import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// @assets
import {
  IconArrowLeft,
  IconSparkles,
  IconCopy,
  IconDownload,
  IconRefresh,
  IconBulb,
  IconArrowRight
} from '@tabler/icons-react';

// @project
import { getToolBySlug, getRelatedTools } from '@/utils/api/tools';
import { executeGeneration } from '@/utils/api/windmill';
import { useAuth } from '@/contexts/AuthContext';

/***************************  GLASS TOKENS (same as Command Centre)  ***************************/

const glass = {
  bg: 'rgba(10, 10, 14, 0.80)',
  border: '1px solid rgba(255,255,255,0.03)',
  blur: 'blur(40px)',
  shadow: 'inset 2px 4px 16px 0px rgba(0,0,0,0.25)',
  radius: '24px',
  hoverBorder: 'rgba(255,255,255,0.07)'
};

// Map badge to icon image
const getIconImage = (badge) => {
  const iconMap = {
    Grader: '/images/icons/data-analytic-3d.png',
    'Google Ads': '/images/icons/marketing-strategy-3d.png',
    Audit: '/images/icons/optimization-3d.png',
    Campaign: '/images/icons/promotion-3d.png',
    Budget: '/images/icons/data-analytic-3d.png',
    'PPC Optimization': '/images/icons/backlink-3d.png',
    'Facebook/Meta': '/images/icons/facebook-3d.png',
    Instagram: '/images/icons/social-media-engagement-3d.png',
    Creative: '/images/icons/copywriting-3d.png',
    'Social Media': '/images/icons/social-media-engagement-3d.png',
    SEO: '/images/icons/optimization-3d.png',
    'Content Writing': '/images/icons/copywriting-3d.png',
    Analytics: '/images/icons/data-analytic-3d.png',
    'ROI & Attribution': '/images/icons/data-analytic-3d.png'
  };
  return iconMap[badge] || '/images/icons/marketing-strategy-3d.png';
};

/***************************  TOOL - FULL PAGE  ***************************/

export default function ToolDetailPage() {
  const theme = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const tool = useMemo(() => getToolBySlug(slug), [slug]);
  const relatedTools = useMemo(() => (tool ? getRelatedTools(slug, 4) : []), [slug, tool]);

  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!tool) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5">Tool not found</Typography>
        <Button onClick={() => navigate('/tools')} sx={{ mt: 2 }}>
          Back to Tools
        </Button>
      </Box>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerate = async () => {
    const mainField = tool.formFields.find((f) => f.name === 'mainInput');
    const mainValue = formData.mainInput || '';

    if (mainField?.required && !mainValue.trim()) {
      setError('Please fill in the required field.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const additionalInputs = { ...formData };
      delete additionalInputs.mainInput;

      const response = await executeGeneration({
        toolSlug: tool.slug,
        toolName: tool.name,
        mainInput: mainValue,
        additionalInputs,
        userId: user?.id || 'anonymous'
      });

      setResult(typeof response === 'string' ? response : response?.result || JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tool.slug}-output.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderFormField = (field) => {
    const fieldStyle = {
      '& .MuiOutlinedInput-root': {
        background: 'rgba(255,255,255,0.03)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
      }
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Box key={field.name}>
            <InputLabel sx={{ mb: 0.5, color: 'text.secondary' }}>{field.label}</InputLabel>
            <TextField
              placeholder={field.placeholder}
              required={field.required}
              multiline
              rows={6}
              fullWidth
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={fieldStyle}
            />
          </Box>
        );
      case 'select':
        return (
          <Box key={field.name}>
            <InputLabel sx={{ mb: 0.5, color: 'text.secondary' }}>{field.label}</InputLabel>
            <FormControl fullWidth>
              <Select
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                displayEmpty
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>
                  Select...
                </MenuItem>
                {field.options?.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 'number':
        return (
          <Box key={field.name}>
            <InputLabel sx={{ mb: 0.5, color: 'text.secondary' }}>{field.label}</InputLabel>
            <TextField
              placeholder={field.placeholder}
              required={field.required}
              type="number"
              fullWidth
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={fieldStyle}
            />
          </Box>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.name}
            control={<Checkbox checked={!!formData[field.name]} onChange={(e) => handleFieldChange(field.name, e.target.checked)} />}
            label={field.label}
          />
        );
      default:
        return (
          <Box key={field.name}>
            <InputLabel sx={{ mb: 0.5, color: 'text.secondary' }}>{field.label}</InputLabel>
            <TextField
              placeholder={field.placeholder}
              required={field.required}
              fullWidth
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={fieldStyle}
            />
          </Box>
        );
    }
  };

  return (
    <Stack sx={{ gap: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<IconArrowLeft size={18} />}
        onClick={() => navigate(-1)}
        color="inherit"
        sx={{ fontWeight: 600, alignSelf: 'flex-start' }}
      >
        Back
      </Button>

      {/* Hero - Dark Glass */}
      <Box
        sx={{
          background: glass.bg,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: glass.border,
          boxShadow: glass.shadow,
          borderRadius: glass.radius,
          p: { xs: 2.5, md: 4 },
          overflow: 'hidden'
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 2.5 }}>
              <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>
                <img src={getIconImage(tool.badge)} alt={tool.name} width={64} height={64} style={{ objectFit: 'contain' }} />
              </Box>
              <Box>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {tool.name}
                  </Typography>
                  <Chip label={tool.badge} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'text.primary' }} />
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  {tool.description}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {tool.heroVideo && (
              <Box sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'grey.900', aspectRatio: '16/9' }}>
                <video src={tool.heroVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Main Content - Dark Glass */}
      <Box
        sx={{
          background: glass.bg,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: glass.border,
          boxShadow: glass.shadow,
          borderRadius: glass.radius,
          overflow: 'hidden'
        }}
      >
        <Grid container>
          {/* Left: Form */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ ml: '-1px' }}>
            <Stack sx={{ gap: 3, p: { xs: 2.5, md: 4 } }}>
              <Box>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <IconSparkles size={20} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Generate
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Fill in the details and click Generate
                </Typography>
              </Box>

              <Stack spacing={2.5}>{tool.formFields.map(renderFormField)}</Stack>

              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <IconSparkles size={18} />}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {loading ? 'Generating...' : 'Generate'}
              </Button>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {result && (
                <Box>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Result
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={handleCopy}>
                        <IconCopy size={18} />
                      </IconButton>
                      <IconButton size="small" onClick={handleDownload}>
                        <IconDownload size={18} />
                      </IconButton>
                      <IconButton size="small" onClick={handleGenerate}>
                        <IconRefresh size={18} />
                      </IconButton>
                    </Stack>
                  </Stack>
                  {copied && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Copied
                    </Alert>
                  )}
                  <Box
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: 2,
                      p: 2.5,
                      fontFamily: 'monospace',
                      fontSize: 13,
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 500,
                      overflow: 'auto',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    {result}
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          <Divider {...(!downMD ? { orientation: 'vertical', flexItem: true } : { sx: { width: 1 } })} />

          {/* Right: Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Tips */}
            <Stack sx={{ gap: 2, p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <IconBulb size={18} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Tips
                </Typography>
              </Stack>
              {tool.tips.map((tip, i) => (
                <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {tip.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tip.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {relatedTools.length > 0 && (
              <>
                <Divider />
                <Stack sx={{ gap: 2, p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Related Tools
                  </Typography>
                  {relatedTools.map((rt) => (
                    <Box
                      key={rt.slug}
                      onClick={() => navigate(`/tools/${rt.slug}`)}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
                      }}
                    >
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {rt.name}
                        </Typography>
                        <IconArrowRight size={16} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
