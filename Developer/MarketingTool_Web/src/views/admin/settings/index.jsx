import { useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';

// @assets
import { IconUser, IconPlugConnected, IconBell, IconShield, IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';

// @project
import { useAuth } from '@/contexts/AuthContext';

/***************************  SETTINGS  ***************************/

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account, connections, and preferences.
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab icon={<IconUser size={16} />} iconPosition="start" label="Profile" />
        <Tab icon={<IconPlugConnected size={16} />} iconPosition="start" label="Connections" />
        <Tab icon={<IconBell size={16} />} iconPosition="start" label="Notifications" />
        <Tab icon={<IconShield size={16} />} iconPosition="start" label="Security" />
      </Tabs>

      {/* Profile Tab */}
      {tab === 0 && (
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Typography variant="h6">Profile Information</Typography>
              <Stack direction="row" spacing={2}>
                <TextField label="First Name" defaultValue={user?.firstname || ''} fullWidth />
                <TextField label="Last Name" defaultValue={user?.lastname || ''} fullWidth />
              </Stack>
              <TextField label="Email" defaultValue={user?.email || ''} fullWidth disabled />
              <TextField label="Company" placeholder="Your company name" fullWidth />
              <TextField label="Website" placeholder="https://" fullWidth />
              <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                Save Changes
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Connections Tab */}
      {tab === 1 && (
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                  <IconBrandGoogle size={24} color="#EA4335" />
                  <Box>
                    <Typography variant="subtitle1">Google Ads</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Connect your Google Ads account for campaign management
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="outlined">Connect</Button>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                  <IconBrandFacebook size={24} color="#1877F2" />
                  <Box>
                    <Typography variant="subtitle1">Meta / Facebook</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Connect Meta Business Suite for Facebook and Instagram ads
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="outlined">Connect</Button>
              </Stack>
            </CardContent>
          </Card>
          <Alert severity="info">
            Once connected, campaign data syncs automatically.
          </Alert>
        </Stack>
      )}

      {/* Notifications Tab */}
      {tab === 2 && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Notification Preferences</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Campaign alerts (budget, performance)" />
              <FormControlLabel control={<Switch defaultChecked />} label="Generation completed" />
              <FormControlLabel control={<Switch />} label="Weekly performance digest" />
              <FormControlLabel control={<Switch />} label="Product updates and tips" />
              <Divider />
              <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                Save Preferences
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {tab === 3 && (
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Change Password</Typography>
                <TextField label="Current Password" type="password" fullWidth />
                <TextField label="New Password" type="password" fullWidth />
                <TextField label="Confirm New Password" type="password" fullWidth />
                <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                  Update Password
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">Sessions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your active sessions across devices.
                </Typography>
                <Button variant="outlined" color="error" sx={{ alignSelf: 'flex-start' }}>
                  Sign Out All Devices
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Stack>
  );
}
