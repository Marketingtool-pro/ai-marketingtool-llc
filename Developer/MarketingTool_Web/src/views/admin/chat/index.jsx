import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';

// @project
import { executeChat } from '@/utils/api/windmill';
import { useAuth } from '@/contexts/AuthContext';
import ToolInlineForm from './ToolInlineForm';

// @assets
import { IconSend, IconSettings2, IconArrowRight, IconSparkles, IconMail, IconRobot, IconChartBar, IconArrowLeft } from '@tabler/icons-react';

// ── SECTION DATA (12 per section) ──

export const SECTIONS = [
  {
    id: 'email',
    title: 'Create an Email',
    path: '/chat/create-email',
    icon: <IconMail size={18} />,
    color: '#6366f1',
    tools: [
      { name: 'Cold Outreach Email', slug: 'cold-outreach-email', image: '/images/chat/bew-email-robots.jpg', desc: 'AI-powered cold email sequences' },
      { name: 'Product Launch Email', slug: 'product-launch-email-sequence', image: '/images/chat/bew-outreach.jpg', desc: 'Launch announcements that convert' },
      { name: 'Email Writer', slug: 'email-writer', image: '/images/chat/bew-email-ai.jpg', desc: 'Professional emails in seconds' },
      { name: 'Facebook Ad Copy', slug: 'meta-ai-copywriter', image: '/images/chat/bew-facebook.jpg', desc: 'High-converting ad copy' },
      { name: 'Instagram Caption', slug: 'instagram-caption-generator', image: '/images/chat/bew-social-guide.jpg', desc: 'Engaging captions that drive action' },
      { name: 'Blog Writer', slug: 'blog-writer', image: '/images/chat/bew-web-design.jpg', desc: 'SEO-optimized blog content' },
      { name: 'Sales Page Copy', slug: 'sales-page-copy-writer', image: '/images/chat/bew-social-growth.jpg', desc: 'Persuasive sales copy' },
      { name: 'CTA Writer', slug: 'cta-writer', image: '/images/chat/bew-fb-manager.jpg', desc: 'Click-worthy call-to-actions' },
      { name: 'SEO Title Generator', slug: 'seo-title-generator', image: '/images/chat/bew-google-tips.jpg', desc: 'Headlines that grab attention' },
      { name: 'LinkedIn Ad Copy', slug: 'linkedin-ad-copy-generator', image: '/images/chat/bew-automation.jpg', desc: 'Professional LinkedIn content' },
      { name: 'Article Generator', slug: 'article-generator', image: '/images/chat/bew-seo.jpg', desc: 'Rank higher with AI content' },
      { name: 'Product Description', slug: 'product-description-writer', image: '/images/chat/bew-app-store.jpg', desc: 'Compelling product copy' }
    ]
  },
  {
    id: 'automate',
    title: 'Automate for Me',
    path: '/chat/automate',
    icon: <IconRobot size={18} />,
    color: '#8b5cf6',
    tools: [
      { name: 'Campaign Optimizer', slug: 'campaign-optimization-engine', image: '/images/chat/bew-digital-robot.jpg', desc: 'Optimize campaigns with AI' },
      { name: 'Workflow Builder', slug: 'workflow-automation-builder', image: '/images/chat/bew-ai-hand.jpg', desc: 'Build automated workflows' },
      { name: 'Smart Scheduling', slug: 'smart-scheduling-engine', image: '/images/chat/bew-ai-robot.jpg', desc: 'AI-scheduled posting times' },
      { name: 'Bid Management AI', slug: 'bid-optimization-engine', image: '/images/chat/bew-google-ads.jpg', desc: 'Automated bid strategies' },
      { name: 'Budget Manager', slug: 'budget-manager', image: '/images/chat/bew-store-dash.jpg', desc: 'Maximize ROI on spend' },
      { name: 'Rule-Based Campaign', slug: 'rule-based-campaign-manager', image: '/images/chat/bew-atlas-ai.jpg', desc: 'Set it and forget it rules' },
      { name: 'Post Scheduler', slug: 'post-scheduler', image: '/images/chat/bew-webhooks.jpg', desc: 'Schedule across platforms' },
      { name: 'Retargeting Funnel', slug: 'retargeting-funnel-builder', image: '/images/chat/bew-tracking.jpg', desc: 'Smart audience retargeting' },
      { name: 'Lead Magnet Creator', slug: 'lead-magnet-creator', image: '/images/chat/bew-ml-predict.jpg', desc: 'Create lead magnets with AI' },
      { name: 'Email Automator', slug: 'milestone-email-automator', image: '/images/chat/bew-prompt-eng.jpg', desc: 'Automated drip campaigns' },
      { name: 'A/B Test Manager', slug: 'campaign-ab-test-manager', image: '/images/chat/bew-google-tips2.jpg', desc: 'Automate split testing' },
      { name: 'Social Autopilot', slug: 'ai-paid-social-manager', image: '/images/chat/bew-ai-research.jpg', desc: 'Hands-free social management' }
    ]
  },
  {
    id: 'insights',
    title: 'Get Insights',
    path: '/chat/insights',
    icon: <IconChartBar size={18} />,
    color: '#06b6d4',
    tools: [
      { name: 'Marketing KPI Dashboard', slug: 'marketing-kpi-dashboard', image: '/images/chat/bew-holographic.jpg', desc: 'Real-time marketing analytics' },
      { name: 'Competitor Analysis', slug: 'competitor-analysis-tool', image: '/images/chat/bew-audience.jpg', desc: 'Spy on competitor strategies' },
      { name: 'Keyword Research', slug: 'keyword-research-tool', image: '/images/chat/bew-analytics-float.jpg', desc: 'Find winning keywords' },
      { name: 'Quality Score Checker', slug: 'quality-score-checker', image: '/images/chat/bew-audit.jpg', desc: 'Improve ad quality scores' },
      { name: 'Performance Alerts', slug: 'performance-auto-alerts', image: '/images/chat/bew-google-dash.jpg', desc: 'Track KPIs in real-time' },
      { name: 'ROI Calculator', slug: 'roi-calculator', image: '/images/chat/bew-saas-ui.jpg', desc: 'Calculate marketing ROI' },
      { name: 'Ad Intelligence', slug: 'ad-intelligence-software', image: '/images/chat/bew-saas-library.jpg', desc: 'Research competitor ads' },
      { name: 'Multi-Channel Attribution', slug: 'multi-channel-attribution', image: '/images/chat/bew-nft-dash.jpg', desc: 'Multi-touch attribution' },
      { name: 'Conversion Path Analyzer', slug: 'conversion-path-analyzer', image: '/images/chat/bew-ai-tools.jpg', desc: 'Optimize conversion funnels' },
      { name: 'Budget Planner', slug: 'marketing-budget-planner', image: '/images/chat/bew-ai-money.jpg', desc: 'Plan ad spend intelligently' },
      { name: 'Google Trends Tool', slug: 'google-trends-tool', image: '/images/chat/bew-openai.jpg', desc: 'Catch trends before they peak' },
      { name: 'Reporting Tools', slug: 'reporting-tools', image: '/images/chat/bew-ai-courses.jpg', desc: 'Auto-generated campaign reports' }
    ]
  }
];

// ── TOOL CARD ──

export function ToolCard({ tool, onClick }) {
  return (
    <Box onClick={onClick} sx={{
      position: 'relative', borderRadius: 3, overflow: 'hidden', cursor: 'pointer', height: 260,
      border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { transform: 'translateY(-6px) scale(1.01)', borderColor: 'rgba(255,255,255,0.15)',
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.5)', '& .tool-img': { transform: 'scale(1.08)', filter: 'brightness(1.1)' },
        '& .tool-overlay': { opacity: 1 } }
    }}>
      <Box className="tool-img" sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${tool.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.05) 100%)' }} />
      <Box className="tool-overlay" sx={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, transparent 100%)',
        opacity: 0, transition: 'opacity 0.35s ease' }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', lineHeight: 1.3, mb: 0.5 }}>{tool.name}</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{tool.desc}</Typography>
      </Box>
    </Box>
  );
}

// ── CHAT HERO SECTION (reusable) ──

export function ChatHeroSection({ input, setInput, onSend, loading, inputRef, navigate }) {
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } };

  return (
    <>
      {/* Customize */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, mb: 2 }}>
        <Button variant="outlined" size="small" startIcon={<IconSettings2 size={15} />}
          sx={{ borderRadius: 2.5, borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary', textTransform: 'none', fontSize: '0.8rem',
            '&:hover': { borderColor: 'rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.03)' } }}>
          Customize
        </Button>
      </Box>

      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 1, md: 2 } }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' }, letterSpacing: '-0.03em', lineHeight: 1.15,
          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1.5 }}>
          What can I help you build today?
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '1rem', maxWidth: 480, mx: 'auto' }}>
          Create campaigns, automate workflows, and get actionable insights — all with AI
        </Typography>
      </Box>

      {/* Chat Input */}
      <Box sx={{ maxWidth: 680, mx: 'auto', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, p: 1.5, borderRadius: 3.5,
          bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.25s ease',
          '&:focus-within': { borderColor: 'rgba(99,102,241,0.4)', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)', bgcolor: 'rgba(255,255,255,0.04)' } }}>
          <TextField inputRef={inputRef} fullWidth variant="standard" placeholder="Ask me anything about marketing..."
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            multiline maxRows={4} slotProps={{ input: { disableUnderline: true } }}
            sx={{ '& .MuiInputBase-root': { p: 0, fontSize: '0.95rem' } }} />
          <IconButton onClick={onSend} disabled={!input.trim() || loading}
            sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: input.trim() ? '#6366f1' : 'rgba(255,255,255,0.06)', color: '#fff', transition: 'all 0.2s',
              '&:hover': { bgcolor: '#4f46e5' }, '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' } }}>
            {loading ? <CircularProgress size={16} color="inherit" /> : <IconSend size={18} />}
          </IconButton>
        </Box>
      </Box>

      {/* 3 Navigation Buttons */}
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {[
          { label: 'Create an email', path: '/chat/create-email' },
          { label: 'Automate for me', path: '/chat/automate' },
          { label: 'Get Insights', path: '/chat/insights' }
        ].map((btn) => (
          <Chip key={btn.label} label={btn.label} onClick={() => navigate(btn.path)}
            sx={{ height: 38, px: 1, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'text.primary', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { bgcolor: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)', transform: 'translateY(-1px)' } }} />
        ))}
      </Stack>

      {/* Recents */}
      <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Recents</Typography>
          <Button size="small" endIcon={<IconArrowRight size={13} />} sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.8rem' }}>See All</Button>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
          No recent conversations yet. Start chatting to see history here.
        </Typography>
      </Box>
    </>
  );
}

// ── SECTION ROW ──

function ToolSection({ section, navigate, onToolClick }) {
  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, py: 1, '&:hover .section-arrow': { transform: 'translateX(4px)' } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${section.color}20`, color: section.color }}>
            {section.icon}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>{section.title}</Typography>
        </Stack>
        <Button size="small" onClick={() => navigate(section.path)}
          endIcon={<IconArrowRight size={14} className="section-arrow" style={{ transition: 'transform 0.2s' }} />}
          sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { color: section.color } }}>
          See All
        </Button>
      </Stack>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4 } }}>
        {section.tools.map((tool) => (
          <Box key={tool.slug} sx={{ minWidth: 240, maxWidth: 260, flex: '0 0 auto', scrollSnapAlign: 'start' }}>
            <ToolCard tool={tool} onClick={() => onToolClick(tool.slug)} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/***************************  AI CHAT PAGE  ***************************/

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setChatStarted(true);
    setMessages((prev) => [...prev, { role: 'user', content: msg, ts: Date.now() }]);
    setInput('');
    setLoading(true);
    try {
      const response = await executeChat({ message: msg, sessionId: 'default', userId: user?.id || 'anonymous' });
      const aiContent = typeof response === 'string' ? response : response?.response || response?.result || response?.message || JSON.stringify(response);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiContent, ts: Date.now() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}`, ts: Date.now() }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  // Tool clicked — show inline form
  const handleToolClick = (slug) => { setSelectedTool(slug); };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* ═══ TOOL FORM VIEW ═══ */}
      {selectedTool ? (
        <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 2, md: 3, lg: 4 }, py: 2 }}>
          <ToolInlineForm toolSlug={selectedTool} onBack={() => setSelectedTool(null)} />
        </Box>
      ) : !chatStarted ? (
        /* ═══ HOME VIEW ═══ */
        <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 2, md: 3, lg: 4 }, pb: 6 }}>
          <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <ChatHeroSection input={input} setInput={setInput} onSend={handleSend} loading={loading} inputRef={inputRef} navigate={navigate} />
            {SECTIONS.map((section) => (
              <ToolSection key={section.id} section={section} navigate={navigate} onToolClick={handleToolClick} />
            ))}
          </Box>
        </Box>
      ) : (
        /* ═══ CHAT VIEW ═══ */
        <Stack sx={{ flex: 1 }}>
          <Box sx={{ px: 3, pt: 2 }}>
            <Button size="small" startIcon={<IconArrowLeft size={16} />}
              onClick={() => { setChatStarted(false); setMessages([]); }}
              sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { color: 'text.primary' } }}>
              Back to home
            </Button>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
            <Stack spacing={3} sx={{ maxWidth: 860, mx: 'auto' }}>
              {messages.map((msg, i) => (
                <Fade key={i} in timeout={300}>
                  <Box sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 1.5 }}>
                    {msg.role === 'assistant' && (
                      <Box sx={{ width: 32, height: 32, borderRadius: 2, flexShrink: 0, mt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
                        <IconSparkles size={16} />
                      </Box>
                    )}
                    <Box sx={{ maxWidth: '75%', px: 3, py: 2,
                      borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.04)',
                      border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      color: msg.role === 'user' ? '#fff' : 'text.primary' }}>
                      <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.9rem' }}>{msg.content}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'text.secondary', mt: 1, textAlign: 'right' }}>
                        {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    {msg.role === 'user' && (
                      <Box sx={{ width: 32, height: 32, borderRadius: 2, flexShrink: 0, mt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.08)', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700 }}>
                        {(user?.name?.[0] || 'U').toUpperCase()}
                      </Box>
                    )}
                  </Box>
                </Fade>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }}>
            <Box sx={{ maxWidth: 860, mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, p: 1.5, borderRadius: 3.5,
                bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.25s ease',
                '&:focus-within': { borderColor: 'rgba(99,102,241,0.4)', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)' } }}>
                <TextField fullWidth variant="standard" placeholder="Type your message..." value={input}
                  onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} multiline maxRows={4}
                  slotProps={{ input: { disableUnderline: true } }} sx={{ '& .MuiInputBase-root': { p: 0, fontSize: '0.9rem' } }} />
                <IconButton onClick={handleSend} disabled={!input.trim() || loading}
                  sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: input.trim() ? '#6366f1' : 'rgba(255,255,255,0.06)', color: '#fff', transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#4f46e5' }, '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' } }}>
                  {loading ? <CircularProgress size={16} color="inherit" /> : <IconSend size={18} />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
