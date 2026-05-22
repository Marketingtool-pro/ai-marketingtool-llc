import PropTypes from 'prop-types';
// third-party
import { View, StyleSheet, Text, Image } from '@react-pdf/renderer';

// @types
import { BillingCycle, BillingStatus } from '../../type';

// @assets
import logo from '@/assets/images/logo.png';

const textPrimary = '#1B1B1F';
const textSecondary = '#46464F';
const bgSecondary = '#EFEDF4';

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: 76,
    backgroundColor: bgSecondary
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222'
  },
  caption: {
    color: textSecondary,
    fontWeight: 400
  },
  invoiceText: {
    color: textPrimary
  },
  paidText: {
    color: '#22892F'
  },
  scheduleText: {
    color: '#AE6600'
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  gap28: {
    gap: 28
  },
  gap16: {
    gap: 16
  },
  gap12: {
    gap: 12
  },
  gap4: {
    gap: 4
  },
  width164: {
    width: 164
  },
  image: {
    width: 180,
    height: 44,
    objectFit: 'contain'
  }
});

/***************************  INVOICE - CONTENT  ***************************/

export default function Content({ billingData }) {
  const { id, customer, createdDate, account, billingCycle, billingStatus } = billingData;

  return (
    <View style={styles.section}>
      <View style={styles.gap28}>
        <Image src={logo} style={styles.image} />
        <View style={[styles.gap12, styles.width164]}>
          <View style={[styles.gap4, styles.width164]}>
            <Text style={styles.caption}>
              {customer.firstName} {customer.lastName}
            </Text>
            <Text style={styles.caption}>{customer.address}</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text>BILLED TO</Text>
            <Text style={styles.caption}>{account.profile.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gap12}>
        <View style={styles.gap16}>
          <Text style={styles.title}>Invoice</Text>
          <View style={styles.gap4}>
            <Text style={styles.caption}>
              Invoice: <Text style={styles.invoiceText}>#{id}</Text>
            </Text>
            <Text style={styles.caption}>
              Invoice Date: <Text style={styles.invoiceText}>{createdDate}</Text>
            </Text>
            <Text style={styles.caption}>
              Invoice Amount:{' '}
              <Text style={styles.invoiceText}>
                ${billingCycle === BillingCycle.YEARLY ? account.plan.yearlyPrice : account.plan.monthlyPrice}.00 (USD)
              </Text>
            </Text>
            <Text style={styles.caption}>
              Customer ID: <Text style={styles.invoiceText}>#{customer.id}</Text>
            </Text>
            <Text style={billingStatus === BillingStatus.PAID ? styles.paidText : styles.scheduleText}>{billingStatus}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.gap4}>
          <Text>SUBSCRIPTION</Text>
          <Text style={styles.caption}>
            ID: <Text style={styles.invoiceText}>#{account.id}</Text>
          </Text>
          <Text style={styles.caption}>
            Billing Period: <Text style={styles.invoiceText}>{billingCycle}</Text>
          </Text>
          <Text style={styles.caption}>
            Tax No.: <Text style={styles.invoiceText}>{account.taxNo}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

Content.propTypes = { billingData: PropTypes.any };
