import PropTypes from 'prop-types';
// @mui
import { useColorScheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// @third-party
import { Controller } from 'react-hook-form';
import OTPInput from 'react-otp-input';

// @project
import { ThemeMode } from '@/config';
import { generateFocusStyle } from '@/utils/generateFocusStyle';
import { otpSchema } from '@/utils/validation-schema/common';

/***************************  CODE VERIFICATION  ***************************/

export default function CodeVerification({ control }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  return (
    <Box
      sx={{
        '& input:focus-visible': {
          borderColor: `${theme.vars.palette.primary.main} !important`,
          ...generateFocusStyle(theme.vars.palette.primary.main)
        }
      }}
    >
      <Controller
        control={control}
        name={'otp'}
        rules={otpSchema}
        render={({ field: { value, onChange } }) => (
          <OTPInput
            value={value}
            onChange={onChange}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            containerStyle={{ gap: 6 }}
            inputStyle={{
              width: '100%',
              height: 48,
              fontSize: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: 'solid',
              outline: 'none',
              borderColor: theme.vars.palette.divider,
              ...(colorScheme === ThemeMode.DARK && {
                backgroundColor: theme.vars.palette.grey[100]
              })
            }}
            renderInput={(props) => <input {...props} />}
          />
        )}
      />
    </Box>
  );
}

CodeVerification.propTypes = { control: PropTypes.object };
