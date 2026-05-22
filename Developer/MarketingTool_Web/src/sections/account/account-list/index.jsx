import { useEffect, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

// @mui
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// @third-party
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

// @project
import { useGetAccountFilter, useGetAccounts } from '../api';
import ActionCell from './ActionCell';
import Table from './Table';
import Profile from '@/components/Profile';
import { dateInRange, globalFilterFn, includesSome } from '@/components/third-party/table/FilterFunctions';
import { resetRowSelection } from '@/components/third-party/table/RowSelectionFn';
import { formatDate } from '@/utils/date/formatters';

// @types
import { BillingCycle, BillingStatus } from '@/sections/account/type';

// @assets
import { IconBan, IconCancel, IconChevronDown, IconChevronRight, IconCircleCheck, IconClock } from '@tabler/icons-react';

/***************************  CHIP - STATUS COLOR  ***************************/

const statusColor = {
  [BillingStatus.PAID]: { color: 'success', icon: <IconCircleCheck /> },
  [BillingStatus.SCHEDULED]: { color: 'warning', icon: <IconClock /> }
};

/***************************  COMPONENT - TABLE  ***************************/

export default function AccountList() {
  const swrKey = useLoaderData();
  const { accounts } = useGetAccounts(swrKey);

  const { accountFilter } = useGetAccountFilter();

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState(accountFilter?.columnFilters || []);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    if (accountFilter) {
      setGlobalFilter(accountFilter?.globalFilter || '');
      setColumnFilters(accountFilter?.columnFilters || []);
    }
  }, [accountFilter]);

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            size="small"
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
            slotProps={{ input: { 'aria-label': 'select all' } }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size="small"
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
            slotProps={{ input: { 'aria-label': 'select' } }}
          />
        ),
        meta: { align: 'center', sx: { width: 40 } }
      },
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <IconButton
              color={row.getIsExpanded() ? 'primary' : 'secondary'}
              onClick={row.getToggleExpandedHandler()}
              size="small"
              aria-label="expand"
            >
              {row.getIsExpanded() ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />}
            </IconButton>
          ) : (
            <IconButton color="secondary" size="small" disabled aria-label="cancel">
              <IconCancel />
            </IconButton>
          );
        },
        meta: { align: 'center', sx: { width: 40 } }
      },
      {
        id: 'profile',
        header: 'Profile',
        // set column with user `fullName`
        cell: ({ row }) => {
          const { firstName, lastName, username } = row.original.profile;
          return (
            <Profile
              title={`${firstName} ${lastName}`}
              caption={username}
              {...(row.original.isBlocked && {
                label: (
                  <Tooltip title="Blocked account">
                    <IconBan size={14} />
                  </Tooltip>
                )
              })}
              sx={{ '& svg': { color: 'error.main' } }}
            />
          );
        },
        accessorFn: (row) => `${row.profile.firstName} ${row.profile.lastName}`
      },
      // set for global search, hide by columnVisibility `username`: false
      { id: 'username', header: 'Username', accessorFn: (row) => row.profile.username },
      // `accessorFn` - set column with plan `name`
      { id: 'plan', header: 'Plan', accessorFn: (row) => row.plan.name, filterFn: includesSome },
      {
        id: 'createdDate',
        accessorKey: 'createdDate',
        header: 'Created Date',
        filterFn: dateInRange,
        cell: ({ row }) => {
          const raw = row.original.createdDate;
          return raw ? formatDate(raw) : '-';
        }
      },
      {
        id: 'billingCycle',
        header: 'Pricing (in USD)',
        // sorting column with plan `yearlyPrice` or `monthlyPrice`
        accessorFn: (row) => (row.billingCycle === BillingCycle.YEARLY ? row.plan.yearlyPrice : row.plan.monthlyPrice),
        cell: ({ row }) => {
          return (
            <Typography color="text.primary" variant="body2" sx={{ pr: 2.75 }}>
              ${row.original.billingCycle === BillingCycle.YEARLY ? row.original.plan.yearlyPrice : row.original.plan.monthlyPrice}.00
            </Typography>
          );
        },
        meta: { align: 'right' }
      },
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
        cell: ({ row }) => <ActionCell row={row.original} onDelete={(id) => onDeleteRow(id)} />
      }
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const columnIds = useMemo(() => columns.map((col) => col.id).filter(Boolean), [columns]);

  const table = useReactTable({
    data: accounts,
    columns,
    state: { rowSelection, sorting, globalFilter, columnFilters, columnVisibility: { username: false } },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => globalFilterFn(row, columnIds, filterValue),
    onColumnFiltersChange: setColumnFilters,
    filterFns: { includesSome, dateInRange },
    // set rowId from data account
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  // Call function after delete single row by id from dialog
  const onDeleteRow = (id) => {
    resetRowSelection(table, id.toString());
  };

  // Global filter search
  const onGlobalSearch = (globalFilter) => {
    setGlobalFilter(globalFilter);
  };

  return <Table {...{ table, onGlobalSearch }} />;
}
