import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import RouterLink from '@/components/Link';
import MainCard from '@/components/MainCard';

// @assets
import { IconLink } from '@tabler/icons-react';

/***************************  PUBLISHED LANGUAGE - DATA  ***************************/

const languages = [{ name: 'English', isDefault: true }, { name: 'Spanish' }];

/***************************  I18N - PUBLISHED LANGUAGE  ***************************/

function PublishedLanguage({ name, isDefault, language }) {
  return (
    <Box sx={{ '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
      <Stack direction="row" sx={{ p: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          <Typography variant="h5">{name}</Typography>
          {isDefault && <Chip color="primary" label="Default" />}
        </Stack>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', height: 48 }}>
          <Button
            id="btn-localize"
            startIcon={<IconLink size={16} />}
            component={RouterLink}
            to={`/setting/internationalization/translate/${language}`}
          >
            Localize
          </Button>
          {/* <IconButton color="secondary" size="small" aria-label="more">
            <IconDotsVertical size={20} />
          </IconButton> */}
        </Stack>
      </Stack>
    </Box>
  );
}

/***************************  I18N - PUBLISHED LANGUAGES  ***************************/

export default function Published() {
  return (
    <MainCard sx={{ p: 0 }}>
      <CardHeader
        title="Published languages"
        subheader="Active in the markets they’ve been added to and visible to customers"
        sx={{ p: { xs: 1.75, sm: 2.25, md: 3 } }}
        slotProps={{ title: { sx: { fontWeight: 400 } }, subheader: { variant: 'body2', sx: { color: 'grey.700' } } }}
      />
      {languages.map((language, index) => (
        <PublishedLanguage key={index} {...language} language={language.name.toLowerCase()} />
      ))}
    </MainCard>
  );
}

PublishedLanguage.propTypes = { name: PropTypes.string, isDefault: PropTypes.bool, language: PropTypes.string };
