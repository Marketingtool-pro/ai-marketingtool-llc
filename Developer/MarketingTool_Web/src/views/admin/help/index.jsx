import { useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';

// @assets
import {
  IconSearch,
  IconChevronDown,
  IconBook,
  IconMessageCircle,
  IconMail,
  IconBrandYoutube,
  IconRocket,
  IconKey,
  IconCreditCard,
  IconPlugConnected
} from '@tabler/icons-react';

const FAQ = [
  {
    q: 'How do I connect my Google Ads account?',
    a: 'Go to Settings → Connections → Google Ads. Click "Connect" and authorize MarketingTool to access your ad account. You\'ll need admin-level access to the Google Ads account.'
  },
  {
    q: 'How do I connect my Meta/Facebook account?',
    a: 'Go to Settings → Connections → Meta. Click "Connect" and authorize through Facebook. Make sure you have Business Manager admin access for the ad accounts you want to manage.'
  },
  {
    q: 'How many AI generations do I get per month?',
    a: 'Free Trial: 10 generations. Starter: 500/mo. Professional: 2,000/mo. All Tools: Unlimited. Unused credits do not roll over.'
  },
  {
    q: 'What happens after my free trial ends?',
    a: 'After 7 days, your account will downgrade to read-only mode. Your data is preserved. Upgrade to any paid plan to continue generating content and managing campaigns.'
  },
  {
    q: 'Can I export my generated content?',
    a: 'Yes. Every tool output includes Copy and Download buttons. Reports can be exported as CSV. Campaign data can be exported from the Analytics page.'
  },
  {
    q: 'How does the AI generate content?',
    a: 'MarketingTool uses advanced AI models (Claude by Anthropic) optimized for marketing. Each tool has specialized prompts and context for high-quality, platform-specific outputs.'
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is encrypted in transit (TLS 1.3) and at rest. We use Supabase with Row Level Security (RLS) — each user can only access their own data. We never share your data with third parties.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, all plans are month-to-month (or annual). Cancel anytime from Settings → Billing. Your access continues until the end of the billing period.'
  }
];

const HELP_CATEGORIES = [
  { title: 'Getting Started', icon: IconRocket, count: 5 },
  { title: 'Account & Billing', icon: IconCreditCard, count: 8 },
  { title: 'API Keys & Auth', icon: IconKey, count: 4 },
  { title: 'Integrations', icon: IconPlugConnected, count: 6 }
];

/***************************  HELP CENTER  ***************************/

export default function HelpPage() {
  const [search, setSearch] = useState('');

  const filteredFaq = FAQ.filter(
    (f) => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={4}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Help Center
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Find answers, documentation, and support.
        </Typography>
        <TextField
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 500, width: '100%' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              )
            }
          }}
        />
      </Box>

      {/* Category Cards */}
      <Grid container spacing={2}>
        {HELP_CATEGORIES.map((cat) => (
          <Grid key={cat.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardActionArea>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <cat.icon size={32} style={{ opacity: 0.6, marginBottom: 8 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {cat.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {cat.count} articles
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAQ */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        {filteredFaq.map((faq, i) => (
          <Accordion key={i} disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' }, mb: 1 }}>
            <AccordionSummary expandIcon={<IconChevronDown size={18} />}>
              <Typography variant="subtitle2">{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Contact */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <IconMessageCircle size={28} style={{ marginBottom: 8 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Live Chat
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available Mon-Fri, 9am-6pm IST
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea href="mailto:help@marketingtool.pro">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <IconMail size={28} style={{ marginBottom: 8 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email Support
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  help@marketingtool.pro
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <IconBrandYoutube size={28} style={{ marginBottom: 8 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Video Tutorials
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Step-by-step guides
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
