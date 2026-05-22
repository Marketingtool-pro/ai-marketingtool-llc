import { useState } from 'react';

// @mui
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// @project
import MainCard from '@/components/MainCard';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  AUTHENTICATION - SETTINGS  ***************************/

const settings = [
  { id: 1, primary: 'Require email verification', secondary: 'Users need to verify their email before using the application' },
  { id: 2, primary: 'Require organization', secondary: 'Organization name is required to register' },
  { id: 3, primary: 'Require name', secondary: 'User name is required to register' },
  { id: 4, primary: 'Subscription required', secondary: 'Active subscription is required to use the application' },
  { id: 5, primary: 'Allow subscription before sign up', secondary: 'Users can subscribe/buy before setting up their account' },
  { id: 6, primary: 'Allow sign up without subscription', secondary: 'Users can register before subscribing/buying a plan' }
];

/***************************  SETTING - AUTHENTICATION  ***************************/

export default function AuthenticationSetting() {
  const [checked, setChecked] = useState([3, 6]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <PageAnimateWrapper>
      <MainCard>
        <List disablePadding>
          {settings.map((setting) => (
            <ListItem
              disableGutters
              disablePadding
              key={setting.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  checked={checked.indexOf(setting.id) !== -1}
                  onChange={handleToggle(setting.id)}
                  slotProps={{ input: { 'aria-labelledby': `checkbox-list-label-${setting.id}` } }}
                />
              }
              sx={{ '&:not(:last-of-type)': { mb: 3 } }}
            >
              <ListItemText
                id={`checkbox-list-label-${setting.id}`}
                primary={setting.primary}
                secondary={setting.secondary}
                slotProps={{
                  primary: { variant: 'subtitle1' },
                  secondary: { variant: 'body1', sx: { width: 'calc(100% - 36px)', color: 'grey.700', mt: 0.5 } }
                }}
              />
            </ListItem>
          ))}
        </List>
      </MainCard>
    </PageAnimateWrapper>
  );
}
