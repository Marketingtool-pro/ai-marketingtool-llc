import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

// @third-party
import { PDFDownloadLink } from '@react-pdf/renderer';

// @project
import MyDocument from './export-pdf';
import InvoicePreview from './InvoicePreview';

// @assets
import { IconDownload, IconEye } from '@tabler/icons-react';

/***************************  BILLING - ACTION CELL  ***************************/

export function ActionCell({ billingData }) {
  const theme = useTheme();

  return (
    <PDFDownloadLink document={<MyDocument {...{ billingData }} />} fileName="invoice.pdf" target="_blank" tabIndex={-1}>
      <Tooltip title="Download PDF" arrow placement="top">
        <IconButton color="secondary" size="small">
          <IconDownload size="16" color={theme.vars.palette.text.secondary} />
        </IconButton>
      </Tooltip>
    </PDFDownloadLink>
  );
}

export function InvoiceActionCell({ billingData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        title={
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
            <IconEye size={16} /> Preview
          </Stack>
        }
        placement="top"
        arrow
      >
        <Button size="small" onClick={() => setOpen(true)}>
          #{billingData.id}
        </Button>
      </Tooltip>
      <InvoicePreview {...{ billingData, open, onClose: () => setOpen(false) }} />
    </>
  );
}

ActionCell.propTypes = { billingData: PropTypes.any };

InvoiceActionCell.propTypes = { billingData: PropTypes.any };
