import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// @project
import { SECTIONS, ToolCard, ChatHeroSection } from '../index';
import ToolInlineForm from '../ToolInlineForm';
import { useAuth } from '@/contexts/AuthContext';

// @assets
import { IconMail } from '@tabler/icons-react';

export default function CreateEmail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const section = SECTIONS.find((s) => s.id === 'email');

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    navigate('/chat');
  };

  if (selectedTool) {
    return (
      <Box sx={{ height: 'calc(100vh - 120px)', overflow: 'auto', px: { xs: 2, md: 3, lg: 4 }, py: 2 }}>
        <ToolInlineForm toolSlug={selectedTool} onBack={() => setSelectedTool(null)} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', overflow: 'auto', px: { xs: 2, md: 3, lg: 4 }, pb: 6 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ChatHeroSection input={input} setInput={setInput} onSend={handleSend} loading={loading} inputRef={inputRef} navigate={navigate} />

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
            <IconMail size={20} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>Create an Email</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>12 AI-powered email and copy tools</Typography>
          </Box>
        </Stack>

        <Grid container spacing={2.5}>
          {section.tools.map((tool) => (
            <Grid key={tool.slug} size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
              <ToolCard tool={tool} onClick={() => setSelectedTool(tool.slug)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
