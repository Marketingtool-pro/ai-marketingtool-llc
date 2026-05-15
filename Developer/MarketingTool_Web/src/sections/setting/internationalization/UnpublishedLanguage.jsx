import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import RouterLink from '@/components/Link';
import MainCard from '@/components/MainCard';

// @assets
import { IconAlertCircle, IconLink } from '@tabler/icons-react';

/***************************  UNPUBLISHED LANGUAGES - DATA  ***************************/

const languages = [{ name: 'Danish' }, { name: 'Indonesian' }];

/***************************  I18N - UNPUBLISHED LANGUAGE  ***************************/

function UnpublishedLanguage({ name, language }) {
  return (
    <Box sx={{ '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
      <Stack direction="row" sx={{ p: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h5">{name}</Typography>
          <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center', color: 'text.disabled' }}>
            <IconAlertCircle size={20} />
            <Typography variant="body1">No translations added</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', height: 48 }}>
          <Box>
            <Button
              id="basic-button"
              startIcon={<IconLink size={16} />}
              component={RouterLink}
              to={`/setting/internationalization/translate/${language}`}
            >
              Translate
            </Button>
          </Box>
          {/* <IconButton color="secondary" size="small" aria-label="more">
            <IconDotsVertical size={20} />
          </IconButton> */}
        </Stack>
      </Stack>
    </Box>
  );
}

/*************************** I18N - UNPUBLISHED LANGUAGES  ***************************/

export default function Unpublished() {
  return (
    <MainCard sx={{ p: 0 }}>
      <CardHeader
        title="Unpublished languages"
        subheader="These languages are only visible to you"
        sx={{ p: { xs: 1.75, sm: 2.25, md: 3 } }}
        slotProps={{ title: { sx: { fontWeight: 400 } }, subheader: { variant: 'body2', sx: { color: 'grey.700' } } }}
      />
      {languages.map((language, index) => (
        <UnpublishedLanguage key={index} {...language} language={language.name.toLowerCase()} />
      ))}
    </MainCard>
  );
}

UnpublishedLanguage.propTypes = { name: PropTypes.string, language: PropTypes.string };
