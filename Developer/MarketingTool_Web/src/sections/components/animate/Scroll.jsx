import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// @third-party
import { motion } from 'motion/react';
import { IconRefresh } from '@tabler/icons-react';

// @project
import Sidebar from './Sidebar';
import MainCard from '@/components/MainCard';
import { createAnimations } from '@/components/third-party/motion/animate/animate';

/***************************  ANIMATE - SCROLL  ***************************/

export default function Scroll() {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [animationType, setAnimationType] = useState('slideInUp');
  const [imageIndex, setImageIndex] = useState(0);

  const animations = createAnimations();

  const handleAnimationChange = (type) => {
    setAnimationType(type);
    setImageIndex((prev) => prev + 1);
  };
  const items = [];
  for (let i = 1; i <= 15; i++) {
    items.push(`Item ${i}`);
  }

  return (
    <MainCard sx={{ p: 0 }}>
      <Grid container direction={{ xs: 'column-reverse', md: 'row' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Sidebar onAnimationChange={handleAnimationChange} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }} sx={{ p: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            {downSM ? (
              <IconButton
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setImageIndex((prev) => prev + 1)}
                aria-label="outlined primary button"
              >
                <IconRefresh size={16} />
              </IconButton>
            ) : (
              <Button
                variant="outlined"
                startIcon={<IconRefresh size={16} />}
                color="secondary"
                size="small"
                onClick={() => setImageIndex((prev) => prev + 1)}
                sx={{ alignSelf: 'center' }}
              >
                Refresh Animation
              </Button>
            )}
          </Stack>

          <Stack sx={{ gap: 2, py: 3 }}>
            {items.map((label, index) => {
              const selectedAnimation = animations[animationType];

              return (
                <motion.div
                  key={`${animationType}-${index}-${imageIndex}`}
                  initial={selectedAnimation.initial}
                  whileInView={selectedAnimation.animate}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <MainCard
                    sx={{
                      bgcolor: 'grey.50',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      py: 2
                    }}
                  >
                    <Typography>{label}</Typography>
                  </MainCard>
                </motion.div>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
