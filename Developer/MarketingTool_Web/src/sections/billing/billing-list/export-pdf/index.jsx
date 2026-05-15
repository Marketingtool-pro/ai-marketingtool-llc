import PropTypes from 'prop-types';

// third-party
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// @project
import Content from './Content';
import Table from './Table';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontWeight: 500
  },
  notesBox: {
    padding: 10,
    backgroundColor: '#F5F2FA',
    borderRadius: 4
  },
  notesTitle: {
    fontWeight: 500
  },
  notesContent: {
    color: '#46464F'
  },
  gap60: {
    gap: 60
  },
  gap20: {
    gap: 20
  }
});

/***************************  INVOICE - PDF  ***************************/

export default function MyDocument({ billingData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.gap60}>
          <View style={styles.gap20}>
            <Content billingData={billingData} />
            <Table billingData={billingData} />
          </View>
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>
              Notes: <Text style={styles.notesContent}>Please pay your invoice within 30 days of receiving it.</Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

MyDocument.propTypes = { billingData: PropTypes.any };
