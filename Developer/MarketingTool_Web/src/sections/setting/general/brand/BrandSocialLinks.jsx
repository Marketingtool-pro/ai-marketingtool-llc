import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// @project
import SettingCard from '@/components/cards/SettingCard';
import DynamicIcon from '@/components/DynamicIcon';

// @assets
import { IconLink, IconTrash } from '@tabler/icons-react';

/****************************  SOCIAL LINK - DATA  ************************* */

const SocialData = [
  {
    id: '1',
    title: 'Instagram',
    icon: 'IconBrandInstagram',
    placeholder: 'eg. https://instagram.com/saasable'
  },
  {
    id: '2',
    title: 'Linkedin',
    icon: 'IconBrandLinkedin',
    placeholder: 'eg. https://linkedin.com/saasable'
  },
  {
    id: '3',
    title: 'Twitter',
    icon: 'IconBrandX',
    placeholder: 'eg. https://twitter.com/saasable'
  },
  {
    id: '4',
    title: 'Discord',
    icon: 'IconBrandDiscord',
    placeholder: 'eg. https://discord.com/saasable'
  }
];

/****************************  BRAND - SOCIAL LINK  ************************* */

export default function BrandSocialLinks({ selectedTags, setSelectedTags, isDisabled = false }) {
  const theme = useTheme();

  const [value, setValue] = useState(
    selectedTags || [
      {
        id: '1',
        title: 'Instagram',
        icon: 'IconBrandInstagram',
        placeholder: 'eg. https://instagram.com/saasable'
      }
    ]
  );

  const [links, setLinks] = useState({
    Instagram: '',
    Linkedin: '',
    Twitter: '',
    Discord: ''
  });

  // Handle link change
  const handleLinkChange = (platform, event) => {
    if (event.target instanceof HTMLInputElement) {
      setLinks({ ...links, [platform]: event.target.value });
    }
  };

  // Handle remove platform
  const handleRemove = (platform) => {
    const updatedValue = value.filter((item) => item.id !== platform.id);
    setValue(updatedValue);
    if (setSelectedTags) setSelectedTags(updatedValue);
  };

  return (
    <SettingCard title="Social Links" caption="Social links for your business, often used in the theme footer">
      <Box sx={{ p: 3 }}>
        <InputLabel>Add Social Links</InputLabel>
        <Autocomplete
          multiple
          options={SocialData}
          disableCloseOnSelect
          value={value}
          disabled={isDisabled}
          onChange={(_event, newValue) => {
            setValue(newValue);
            if (setSelectedTags) setSelectedTags(newValue);
          }}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          slotProps={{ chip: { clickable: true, variant: 'tag', size: 'small', sx: { margin: 0.25 } } }}
          renderOption={({ key: optionKey, ...optionProps }, option, { selected }) => (
            <li key={optionKey} {...optionProps}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: 1 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                  <Checkbox checked={selected} sx={{ p: 0 }} />
                  {option.title}
                </Stack>
              </Stack>
            </li>
          )}
          renderInput={(params) => <TextField {...params} placeholder="Select Social Links" />}
          sx={{ width: 1 }}
        />

        {value.map((platform) => (
          <Box sx={{ mt: 2 }} key={platform.id}>
            <InputLabel>{platform.title}</InputLabel>
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <OutlinedInput
                placeholder={platform.placeholder}
                fullWidth
                value={links[platform.title] || ''}
                onChange={(e) => handleLinkChange(platform.title, e)}
                startAdornment={
                  <InputAdornment position="start">
                    <DynamicIcon name={platform.icon} color={theme.vars.palette.secondary.main} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconLink />
                  </InputAdornment>
                }
                aria-describedby={`outlined-${platform.title}`}
                slotProps={{ input: { 'aria-label': platform.title } }}
              />
              <IconButton size="small" variant="outlined" aria-label="delete" color="error" onClick={() => handleRemove(platform)}>
                <IconTrash size={16} />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Box>
    </SettingCard>
  );
}

BrandSocialLinks.propTypes = { selectedTags: PropTypes.array, setSelectedTags: PropTypes.func, isDisabled: PropTypes.bool };
