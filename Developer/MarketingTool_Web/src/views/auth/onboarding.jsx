import { useState, useEffect } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

// @project
import { AvatarSize } from '@/enum';
import BasicInformation from '@/sections/auth/onboarding/BasicInformation';
import CompanyDetail from '@/sections/auth/onboarding/CompanyDetail';
import Preferenace from '@/sections/auth/onboarding/Preferenace';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconBuildingStore, IconChevronLeft, IconChevronRight, IconSettings, IconUser } from '@tabler/icons-react';

// stepper style
const StepLabelStyle = styled(StepLabel)(({ theme }) => ({
  '& .Mui-active, & .Mui-completed': {
    '& .MuiAvatar-root': {
      backgroundColor: theme.vars.palette.primary.lighter,
      color: theme.vars.palette.primary.darker
    }
  },
  '&.Mui-disabled': {
    '& .MuiAvatar-root': {
      backgroundColor: theme.vars.palette.grey[100],
      color: theme.vars.palette.grey[800]
    }
  },
  '& .MuiStepLabel-label': {
    [theme.breakpoints.down('sm')]: { display: 'none' },
    '&.Mui-active': {
      color: theme.vars.palette.primary.darker
    }
  },
  '& .MuiStepLabel-iconContainer': {
    paddingRight: theme.spacing(0.75),
    [theme.breakpoints.down('sm')]: { paddingRight: 0 }
  }
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.vars.palette.divider
  }
}));

/***************************  STEPS - DATA  ***************************/

const steps = [
  { label: 'Basics', icon: <IconUser /> },
  { label: 'Company Details', icon: <IconBuildingStore /> },
  { label: 'Preferences', icon: <IconSettings /> }
];

/***************************  AUTH - STEP CONTENT  ***************************/

const StepContent = ({ step, onValidate }) => {
  switch (step) {
    case 0:
      return <BasicInformation onValidate={onValidate} />;
    case 1:
      return <CompanyDetail />;
    case 2:
      return <Preferenace />;
    default:
      return <BasicInformation onValidate={onValidate} />;
  }
};

/***************************  AUTH - ONBOARDING  ***************************/

export default function Onboarding() {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(false);

  const handleNext = () => {
    // Apply validation only for the first step
    if (activeStep === 0 && !isStepValid) {
      // Trigger validation
      setIsStepValid(false);
      return;
    }
    if (activeStep === steps.length - 1) {
      // Redirect to login page when "Save with Continue" is clicked
      router.push('/auth/login');
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleValidation = (isValid) => {
    if (activeStep === 0) {
      setIsStepValid(isValid);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  useEffect(() => {
    // Reset validation status when the step changes
    if (activeStep !== 0) {
      setIsStepValid(true);
    }
  }, [activeStep]);

  return (
    <Stack sx={{ maxWidth: 458, height: 1, justifyContent: 'center', marginInline: 'auto', gap: 5 }}>
      <Stepper activeStep={activeStep} connector={<ColorlibConnector />} sx={{ mx: { xs: 4, sm: 0 } }}>
        {steps.map((item, index) => {
          return (
            <Step key={index} sx={{ '&:first-of-type': { paddingLeft: 0 }, '&:last-of-type': { paddingRight: 0 } }}>
              <StepLabelStyle slots={{ stepIcon: () => <Avatar size={downSM ? AvatarSize.XS : AvatarSize.XXS}>{item.icon}</Avatar> }}>
                {item.label}
              </StepLabelStyle>
            </Step>
          );
        })}
      </Stepper>
      <>
        <StepContent step={activeStep} onValidate={handleValidation} />
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<IconChevronLeft size={16} />}
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            sx={{ minWidth: 120 }}
            endIcon={activeStep !== steps.length - 1 ? <IconChevronRight size={16} /> : null}
            disabled={activeStep === 0 && !isStepValid}
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Save & Continue' : 'Next'}
          </Button>
        </Stack>
      </>
    </Stack>
  );
}
