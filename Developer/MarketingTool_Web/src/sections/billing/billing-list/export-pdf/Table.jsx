import PropTypes from 'prop-types';
// third-party
import { Text, View, StyleSheet } from '@react-pdf/renderer';

// @types
import { BillingCycle, BillingStatus } from '../../type';

const textSecondary = '#46464F';
const bgSecondary = '#EFEDF4';

const styles = StyleSheet.create({
  dividerRight: {
    height: 1,
    backgroundColor: bgSecondary,
    width: 106,
    marginLeft: 'auto'
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottom: `1 solid ${bgSecondary}`,
    borderTop: `1 solid ${bgSecondary}`,
    paddingBottom: 10,
    paddingTop: 10
  },

  headerAmount: {
    flex: 1,
    textAlign: 'right'
  },

  usdNote: {
    fontSize: 10
  },

  tableRow: {
    flexDirection: 'row',
    borderBottom: `1 solid ${bgSecondary}`,
    paddingBottom: 20,
    paddingTop: 20
  },

  amountText: {
    flex: 1,
    textAlign: 'right'
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    alignSelf: 'flex-end'
  },

  adjustments: {
    color: textSecondary
  },

  gap12: {
    gap: 12
  }
});

/***************************  INVOICE - TABLE  ***************************/

export default function Table({ billingData }) {
  const { account, billingCycle, billingStatus } = billingData;

  return (
    <View style={styles.gap12}>
      <View>
        <View style={styles.tableHeader}>
          <Text>DESCRIPTION</Text>
          <Text style={styles.headerAmount}>
            AMOUNT <Text style={styles.usdNote}>(USD)</Text>
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text>Standard {billingCycle} plan</Text>
          <Text style={styles.amountText}>
            ${billingCycle === BillingCycle.YEARLY ? account.plan.yearlyPrice : account.plan.monthlyPrice}.00
          </Text>
        </View>
      </View>

      <View style={styles.totalRow}>
        <Text>Total</Text>
        <Text>${billingCycle === BillingCycle.YEARLY ? account.plan.yearlyPrice : account.plan.monthlyPrice}.00</Text>
      </View>
      <View style={[styles.totalRow, styles.adjustments]}>
        <Text>Adjustments</Text>
        <Text>
          ($
          {billingStatus === BillingStatus.PAID
            ? billingCycle === BillingCycle.YEARLY
              ? account.plan.yearlyPrice
              : account.plan.monthlyPrice
            : 0}
          .00)
        </Text>
      </View>
      <View style={styles.dividerRight} />
      <View style={styles.totalRow}>
        <Text>
          Amount Due <Text style={styles.usdNote}>(USD)</Text>
        </Text>
        <Text>
          $
          {billingStatus !== BillingStatus.PAID
            ? billingCycle === BillingCycle.YEARLY
              ? account.plan.yearlyPrice
              : account.plan.monthlyPrice
            : 0}
          .00
        </Text>
      </View>
      <View style={styles.dividerRight} />
    </View>
  );
}

Table.propTypes = { billingData: PropTypes.any };
