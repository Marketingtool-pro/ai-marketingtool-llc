// @mui
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';

// @project
import branding from '@/branding.json';

/***************************  LOGO - ICON  ***************************/

export default function LogoIcon() {
  const logoIconPath = branding.logo.logoIcon;

  return (
    <Box sx={{ width: 40, height: 40, flexShrink: 0, cursor: 'pointer' }}>
      <CardMedia
        src={logoIconPath}
        component="img"
        alt="MarketingTool"
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
      />
    </Box>
  );
}
