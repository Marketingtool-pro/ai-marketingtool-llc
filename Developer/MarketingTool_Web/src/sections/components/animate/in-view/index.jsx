import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';
import { IconRefresh } from '@tabler/icons-react';

// @project
import Sidebar from './Sidebar';
import MainCard from '@/components/MainCard';
import { createAnimations } from '@/components/third-party/motion/animate/animate';
import { TabsType } from '@/enum';

// assets
import img1 from '@/assets/images/blog/1.jpg';
import img2 from '@/assets/images/blog/2.jpg';
import img3 from '@/assets/images/blog/3.jpg';
import img4 from '@/assets/images/blog/4.jpg';
import img5 from '@/assets/images/blog/5.jpg';
import img6 from '@/assets/images/blog/6.jpg';

const imageList = [img1, img2, img3, img4, img5, img6];

const TEXT = 'SaasAble';
const items = TEXT.split('');

/***************************  ANIMATE - IN VIEW  ***************************/

export default function InViewComponent() {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sectionTab, setSectionTab] = useState('single');
  const [animationType, setAnimationType] = useState('slideInUp');
  const [imageIndex, setImageIndex] = useState(0);

  const animations = createAnimations();

  const handleAnimationChange = (type) => {
    setAnimationType(type);
  };

  const handleSectionTabChange = (_event, newValue) => {
    setSectionTab(newValue);
  };

  return (
    <MainCard sx={{ p: 0 }}>
      <Grid container direction={{ xs: 'column-reverse', md: 'row' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Sidebar onAnimationChange={handleAnimationChange} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack sx={{ gap: { xs: 3, sm: 5 }, p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, zIndex: 1 }}>
              <Tabs value={sectionTab} onChange={handleSectionTabChange} type={TabsType.SEGMENTED} sx={{ flexShrink: 0 }}>
                <Tab value="single" label="Single" />
                <Tab value="multi" label="Multi" />
                <Tab value="text" label="Text" />
              </Tabs>
              {downSM ? (
                <IconButton
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => setImageIndex((prev) => (prev + 1) % imageList.length)}
                >
                  <IconRefresh size={16} />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<IconRefresh size={16} />}
                  color="secondary"
                  size="small"
                  onClick={() => setImageIndex((prev) => (prev + 1) % imageList.length)}
                  sx={{ alignSelf: 'center' }}
                >
                  Refresh Animation
                </Button>
              )}
            </Stack>
            <Stack sx={{ textAlign: 'center' }}>
              {sectionTab === 'text' && (
                <Box sx={{ width: 1, height: 400 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    {items.map((letter, index) => (
                      <motion.div
                        key={`${animationType}-${index}-${imageIndex}`}
                        variants={animations[animationType]}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.03 + index * 0.1 }}
                      >
                        {letter}
                      </motion.div>
                    ))}
                  </Typography>
                </Box>
              )}
              {sectionTab === 'multi' && (
                <Grid container spacing={2}>
                  {imageList.map((src, index) => (
                    <Grid size={12} key={index}>
                      <motion.div
                        key={`${animationType}-${index}-${imageIndex}`}
                        variants={animations[animationType]}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: index * 0.3 }}
                      >
                        <Box
                          component="img"
                          src={src}
                          alt="Responsive image"
                          sx={{
                            objectFit: 'cover',
                            borderRadius: 10,
                            height: 120,
                            width: 1
                          }}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}
              {sectionTab === 'single' && (
                <motion.div
                  key={`${animationType}-${imageIndex}`}
                  variants={animations[animationType]}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.4 }}
                >
                  <Box
                    component="img"
                    src={imageList[1]}
                    alt="Responsive image"
                    sx={{
                      objectFit: 'cover',
                      borderRadius: 10,
                      width: { xs: 260, sm: 400 },
                      height: { xs: 260, sm: 400 }
                    }}
                  />
                </motion.div>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
