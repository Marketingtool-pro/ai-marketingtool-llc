import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar, useSnackbar, SnackbarContent } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconChevronsDown, IconCircleCheck, IconX } from '@tabler/icons-react';

const SnackbarBox = styled(SnackbarContent)(() => ({
  '@media (min-width:600px)': {
    minWidth: '344px !important'
  }
}));

/***************************  NOTISTACK - CUSTOM  ***************************/

function CustomNotistack({ id, message, ref }) {
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((prevState) => !prevState);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarBox ref={ref}>
      <Card sx={{ bgcolor: 'warning.light', width: '100%' }}>
        <CardActions sx={{ padding: '8px 8px 8px 16px', justifyContent: 'space-between', bgcolor: 'warning.light' }}>
          <Typography variant="subtitle2">{message}</Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
              aria-label="Show more"
              color="warning"
              size="small"
              sx={{ p: 1, transition: 'all .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              onClick={handleExpandClick}
            >
              <IconChevronsDown size={20} />
            </IconButton>
            <IconButton sx={{ p: 1, transition: 'all .2s' }} size="small" onClick={handleDismiss} color="error">
              <IconX size={20} />
            </IconButton>
          </Box>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper sx={{ padding: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0, bgcolor: 'warning.lighter' }}>
            <Typography gutterBottom>PDF ready</Typography>
            <Button color="secondary" size="small" startIcon={<IconCircleCheck size={18} />}>
              Download now
            </Button>
          </Paper>
        </Collapse>
      </Card>
    </SnackbarBox>
  );
}

/***************************  NOTISTACK - CUSTOM STYLE  ***************************/

export default function CustomComponent() {
  return (
    <PresentationCard title="Custom Component">
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          enqueueSnackbar('Your report is ready', {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            },
            content: (key, message) => <CustomNotistack id={key} message={message} />
          });
        }}
      >
        Show snackbar
      </Button>
    </PresentationCard>
  );
}

CustomNotistack.propTypes = { id: PropTypes.any, message: PropTypes.any, ref: PropTypes.object };
