import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// @project
import { applyBorderWithRadius, groupedAnimations } from './animations';

/***************************  SIDEBAR - MAIN  ***************************/

export default function Sidebar({ onAnimationChange }) {
  const theme = useTheme();
  const categoryNames = Object.keys(groupedAnimations);
  const [activeTab, setActiveTab] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState(groupedAnimations[categoryNames[0]][0]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const selectedCategory = categoryNames[newValue];
    const firstAnimation = groupedAnimations[selectedCategory][0];
    setActiveAnimation(firstAnimation);
    onAnimationChange(firstAnimation);
  };

  const handleClick = (type) => {
    setActiveAnimation(type);
    onAnimationChange(type);
  };

  const selectedCategory = categoryNames[activeTab];
  const animations = groupedAnimations[selectedCategory];

  return (
    <Grid container sx={{ ...applyBorderWithRadius(1, theme), border: 'none', height: 1 }}>
      <Grid size={6} sx={{ pt: 1.5 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          orientation="vertical"
          textColor="primary"
          indicatorColor="primary"
        >
          {categoryNames.map((category) => (
            <Tab
              label={category}
              key={category}
              sx={{
                fontSize: 16,
                lineHeight: 1.25,
                mt: 0.5,
                minHeight: 36,
                height: 36,
                '&.Mui-selected': { backgroundColor: 'grey.100' },
                '&:hover': { color: 'primary.main' }
              }}
            />
          ))}
        </Tabs>
      </Grid>

      <Grid size={6} sx={{ pt: 1.5 }}>
        <Tabs
          textColor="primary"
          value={activeAnimation}
          onChange={(e, newValue) => handleClick(newValue)}
          orientation="vertical"
          slotProps={{ indicator: { sx: { backgroundColor: 'transparent' } } }}
        >
          {animations.map((animation) => (
            <Tab
              key={animation}
              value={animation}
              label={animation}
              sx={{
                mt: 0.5,
                minHeight: 36,
                height: 36,
                alignItems: 'flex-start',
                lineHeight: 1,
                fontSize: 16,
                '&:hover': { color: 'primary.main' }
              }}
            />
          ))}
        </Tabs>
      </Grid>
    </Grid>
  );
}

Sidebar.propTypes = { onAnimationChange: PropTypes.func };
