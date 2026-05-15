import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';

// @project
import MyDocument from './export-pdf';
import Logo from '@/components/logo';
import MainCard from '@/components/MainCard';

// @assets
import { IconDownload, IconX } from '@tabler/icons-react';

// @types
import { BillingCycle, BillingStatus } from '../type';

/***************************  INVOICE - PREVIEW  ***************************/

/**
 * `InvoiceModal` component for previewing invoice details.
 * @type {InvoiceModalProps} props
 * @prop {Billing} **billingData** The billing data to be displayed in the modal.
 * @prop {boolean} **open** If `true`, the modal is shown.
 * @prop {() => void} **onClose** Callback fired when the modal is closed.
 * @example
 * <InvoiceModal open={open} onClose={onClose} />
 */

export default function InvoicePreview({ billingData, open, onClose }) {
  const theme = useTheme();

  const { id, customer, createdDate, account, billingCycle, billingStatus } = billingData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{ paper: { sx: { p: 0, minWidth: { xl: 1170, md: 900, sm: 700, xs: '95%' } } } }}
    >
      <DialogTitle id="block-dialog-title">
        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', justifyContent: 'space-between' }}>
          <>Invoice Preview</>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
            <PDFDownloadLink document={<MyDocument {...{ billingData }} />} fileName="invoice.pdf" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                Download
              </Button>
            </PDFDownloadLink>
            <IconButton variant="contained" aria-label="close" sx={{ display: { xs: 'flex', sm: 'none' } }}>
              <IconDownload size={20} />
            </IconButton>
            <IconButton variant="outlined" color="secondary" aria-label="close" onClick={onClose}>
              <IconX size={20} />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, bgcolor: 'grey.100' }}>
        <Container maxWidth="sm">
          <MainCard sx={{ border: 'none', boxShadow: 'none', borderRadius: 0, my: { xs: 1.25, sm: 2.5 } }}>
            <Stack sx={{ gap: 7.5 }}>
              <Stack sx={{ gap: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <Stack sx={{ gap: 3.5 }}>
                      <Logo />
                      <Stack sx={{ gap: 1.5, width: 164 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {customer.firstName} {customer.lastName} <br />
                          {customer.address}
                        </Typography>
                        <Divider sx={{ width: 76 }} />
                        <Typography variant="caption1">
                          BILLED TO <br />
                          <Typography variant="caption" component="span" color="text.secondary">
                            {account.profile.address}
                          </Typography>
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: { xs: 'end', sm: 'start' } }}>
                    <Stack sx={{ gap: 2 }}>
                      <Typography variant="h4">Invoice</Typography>
                      <Stack sx={{ gap: 1.5 }}>
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Invoice:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              #{id}
                            </Typography>
                          </Typography>

                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Invoice Date:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              {createdDate}
                            </Typography>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Invoice Amount:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              ${billingCycle === BillingCycle.YEARLY ? account.plan.yearlyPrice : account.plan.monthlyPrice}.00 (USD)
                            </Typography>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Customer ID:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              #{customer.id}
                            </Typography>
                          </Typography>
                          <Chip
                            size="small"
                            label={billingStatus}
                            color={billingStatus === BillingStatus.PAID ? 'success' : 'warning'}
                            sx={{ width: 'fit-content' }}
                          />
                        </Stack>
                        <Divider sx={{ width: 76, alignSelf: { xs: 'flex-end', sm: 'flex-start' } }} />
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography variant="caption1">SUBSCRIPTION</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ID:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              #{account.id}
                            </Typography>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Billing Period:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              {billingCycle}
                            </Typography>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Tax No.:{' '}
                            <Typography variant="caption1" component="span" sx={{ color: 'text.primary' }}>
                              {account.taxNo}
                            </Typography>
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>

                <Table>
                  <TableHead sx={{ bgcolor: 'transparent', borderTop: `1px solid ${theme.vars.palette.grey[200]}` }}>
                    <TableRow>
                      <TableCell sx={{ px: 0, py: 1.2 }}>
                        <Typography variant="caption1">DESCRIPTION</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 0 }}>
                        <Typography variant="caption1">
                          AMOUNT{' '}
                          <Typography variant="caption1" component="span" sx={{ fontSize: '10px' }}>
                            {' '}
                            (USD)
                          </Typography>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ px: 0, py: 2.45 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Standard {billingCycle} plan
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 0 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          ${billingCycle === BillingCycle.YEARLY ? account.plan.yearlyPrice : account.plan.monthlyPrice}.00
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Grid container sx={{ justifyContent: 'flex-end' }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack sx={{ gap: 1.5 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption1">Total</Typography>
                        <Typography variant="caption1">
                          ${billingCycle === BillingCycle.YEARLY ? account.plan.yearlyPrice : account.plan.monthlyPrice}.00
                        </Typography>
                      </Stack>

                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Adjustments
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          ($
                          {billingStatus === BillingStatus.PAID
                            ? billingCycle === BillingCycle.YEARLY
                              ? account.plan.yearlyPrice
                              : account.plan.monthlyPrice
                            : 0}
                          .00)
                        </Typography>
                      </Stack>

                      <Divider sx={{ width: 106, alignSelf: 'flex-end' }} />

                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          Amount Due{' '}
                          <Typography component="span" variant="body2" sx={{ fontSize: '10px' }}>
                            (USD)
                          </Typography>
                        </Typography>
                        <Typography variant="subtitle2">
                          $
                          {billingStatus !== BillingStatus.PAID
                            ? billingCycle === BillingCycle.YEARLY
                              ? account.plan.yearlyPrice
                              : account.plan.monthlyPrice
                            : 0}
                          .00
                        </Typography>
                      </Stack>

                      <Divider sx={{ width: 106, alignSelf: 'flex-end' }} />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              <Box sx={{ bgcolor: 'grey.100', p: 1.25, borderRadius: 2 }}>
                <Typography variant="caption1">
                  Notes:{' '}
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Please pay your invoice within 30 days of receiving it.
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          </MainCard>
        </Container>
      </DialogContent>
    </Dialog>
  );
}

InvoicePreview.propTypes = { billingData: PropTypes.any, open: PropTypes.any, onClose: PropTypes.any };
