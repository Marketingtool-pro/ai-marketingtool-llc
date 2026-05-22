import { useEffect, useMemo, useState } from 'react';

// @mui
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// @third-party
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

// @project
import { useGetBillingFilter, useGetBillings } from '../api';
import { ActionCell, InvoiceActionCell } from './ActionCell';
import Table from './Table';
import Profile from '@/components/Profile';
import { dateInRange, globalFilterFn, includesSome } from '@/components/third-party/table/FilterFunctions';

// @types
import { BillingCycle, BillingStatus } from '@/sections/billing/type';

// @assets
import { IconBan, IconCircleCheck, IconClock } from '@tabler/icons-react';

/***************************  CHIP - STATUS COLOR  ***************************/

const statusColor = {
  [BillingStatus.PAID]: { color: 'success', icon: <IconCircleCheck /> },
  [BillingStatus.SCHEDULED]: { color: 'warning', icon: <IconClock /> }
};

/***************************  COMPONENT - TABLE  ***************************/

export default function BillingList() {
  const { billings } = useGetBillings();
  const { billingFilter } = useGetBillingFilter();

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState(billingFilter?.columnFilters || []);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    if (billingFilter) {
      setGlobalFilter(billingFilter?.globalFilter || '');
      setColumnFilters(billingFilter?.columnFilters || []);
    }
  }, [billingFilter]);

  const columns = useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Invoice',
        cell: ({ row }) => <InvoiceActionCell billingData={row.original} />
      },
      // `accessorFn` - set column with plan `name`
      { id: 'plan', accessorKey: 'plan', header: 'Plan', accessorFn: (row) => row.account.plan.name, filterFn: includesSome },
      {
        id: 'customer',
        accessorKey: 'customer',
        header: 'Customer',
        // set column with user `fullName`
        accessorFn: (row) => `${row.customer.firstName} ${row.customer.lastName}`,
        cell: ({ row }) => {
          const { firstName, lastName, username } = row.original.customer;
          return (
            <Profile
              title={`${firstName} ${lastName}`}
              caption={username}
              {...(row.original.customer.isBlocked && {
                label: (
                  <Tooltip title="Blocked customer">
                    <IconBan size={14} />
                  </Tooltip>
                )
              })}
              sx={{ '& svg': { color: 'error.main' } }}
            />
          );
        }
      },
      // set for global search, hide by columnVisibility `username`: false
      { id: 'username', accessorKey: 'username', header: 'Username', accessorFn: (row) => row.customer.username },
      {
        id: 'billingCycle',
        accessorKey: 'billingCycle',
        header: 'Amount (in USD)',
        // sorting column with plan `yearlyPrice` or `monthlyPrice`
        accessorFn: (row) => (row.billingCycle === BillingCycle.YEARLY ? row.account.plan.yearlyPrice : row.account.plan.monthlyPrice),
        cell: ({ row }) => {
          return (
            <Typography color="text.primary" variant="body2" sx={{ pr: 2.75 }}>
              $
              {row.original.billingCycle === BillingCycle.YEARLY
                ? row.original.account.plan.yearlyPrice
                : row.original.account.plan.monthlyPrice}
              .00
            </Typography>
          );
        },
        meta: { align: 'right' }
      },
      { id: 'createdDate', accessorKey: 'createdDate', header: 'Due/Paid Date', filterFn: dateInRange },
      {
        id: 'billingStatus',
        accessorKey: 'billingStatus',
        header: 'Billing Status',
        filterFn: includesSome,
        cell: ({ row }) => {
          const { color, icon } = statusColor[row.original.billingStatus] || statusColor[BillingStatus.SCHEDULED];
          return <Chip label={row.original.billingStatus} color={color} icon={icon} size="small" />;
        }
      },
      {
        id: 'action',
        meta: { align: 'center', sx: { width: 76 } },
        cell: ({ row }) => <ActionCell billingData={row.original} />
      }
    ],
    []
  );

  const columnIds = useMemo(() => columns.map((col) => col.id).filter(Boolean), [columns]);

  const table = useReactTable({
    data: billings,
    columns,
    state: { sorting, globalFilter, columnFilters, columnVisibility: { username: false } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => globalFilterFn(row, columnIds, filterValue),
    onColumnFiltersChange: setColumnFilters,
    filterFns: { includesSome, dateInRange },
    // set rowId from data billing
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  // Global filter search
  const onGlobalSearch = (globalFilter) => {
    setGlobalFilter(globalFilter);
  };

  return <Table {...{ table, onGlobalSearch }} />;
}
