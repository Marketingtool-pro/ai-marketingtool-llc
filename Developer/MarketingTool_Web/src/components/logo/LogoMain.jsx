// @mui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';

// @project
import branding from '@/branding.json';

/***************************  LOGO - MAIN  ***************************/

export default function LogoMain() {
  const theme = useTheme();
  const logoMainPath = branding.logo.main;

  return logoMainPath ? (
    <CardMedia src={logoMainPath} component="img" alt="MarketingTool" sx={{ width: { xs: 56, lg: 72 }, height: 'auto' }} />
  ) : (
    <Box sx={{ width: { xs: 112, lg: 140 }, height: { xs: 22, lg: 26 } }}>
      <svg viewBox="0 0 140 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.8829 0.427107C21.4241 -0.961272 24.4323 1.23978 23.8814 4.08446L20.2026 23.083C20.1771 23.2543 20.1385 23.4244 20.0865 23.5919C19.9716 23.983 19.8053 24.3088 19.5985 24.5713L19.5803 24.5963C18.4651 26.1231 16.3244 26.456 14.7989 25.3398C14.0423 24.7862 13.5792 23.9802 13.4405 23.1221L13.4413 23.1226C13.018 21.5306 13.6228 17.2572 16.7968 10.4168L18.0197 11.7888L19.6391 5.17618C19.7118 4.87928 19.3889 4.64305 19.1283 4.80246L13.3241 8.35306L15.0704 9.15363C11.7777 12.6269 7.19306 15.8763 3.94258 16.2187C3.13058 16.3043 2.15871 16.0911 1.40248 15.5377C-0.123006 14.4215 -0.455588 12.279 0.659645 10.7522L0.66829 10.7404L0.678147 10.7271C0.865156 10.4504 1.1246 10.1932 1.46169 9.96519C1.60563 9.86452 1.75619 9.77586 1.91185 9.69943L18.8829 0.427107ZM6.39334 23.161C7.37266 23.8631 8.73948 23.6318 9.44623 22.6444C9.91583 21.9883 10.2609 19.8511 10.4396 18.4907C10.5082 17.9682 9.98185 17.5908 9.50966 17.8239C8.28019 18.431 6.36939 19.4456 5.8998 20.1017C5.19305 21.0891 5.41402 22.4588 6.39334 23.161Z"
          fill={theme.vars.palette.primary.main}
        />
      </svg>
    </Box>
  );
}
