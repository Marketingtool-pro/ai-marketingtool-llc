import { useEffect, useMemo, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

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
import { useGetUserFilter, useGetUsers } from '../api';
import ActionCell from './ActionCell';
import Table from './Table';
import Profile from '@/components/Profile';
import { dateInRange, globalFilterFn, includesSome } from '@/components/third-party/table/FilterFunctions';
import { resetRowSelection } from '@/components/third-party/table/RowSelectionFn';
import { formatDate } from '@/utils/date/formatters';

// @assets
import { IconCancel, IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/***************************  CHIP - STATUS COLOR  ***************************/

const statusColor = {
  Active: 'success',
  Pending: 'warning',
  Reported: 'primary',
  Blocked: 'error'
};

/***************************  COMPONENT - TABLE  ***************************/

export default function UserList() {
  const { users } = useGetUsers();
  const { userFilter } = useGetUserFilter();

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState(userFilter?.columnFilters || []);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    if (userFilter) {
      setGlobalFilter(userFilter?.globalFilter || '');
      setColumnFilters(userFilter?.columnFilters || []);
    }
  }, [userFilter]);

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
        cell: ({ row }) => {
          const { avatar, firstName, lastName, username } = row.original;
          return (
            <Profile
              {...{
                avatar: {
                  src: avatar
                },
                title: `${firstName} ${lastName}`,
                caption: username,
                titleProps: { color: 'text.primary' },
                sx: { gap: 1.5 }
              }}
            />
          );
        },
        accessorFn: (row) => `${row.firstName} ${row.lastName}`
      },
      { id: 'role', accessorKey: 'role', header: 'Role', filterFn: includesSome },
      {
        id: 'activity',
        accessorKey: 'activity',
        header: 'Last Activity',
        cell: ({ row }) => {
          const { activity, timePeriod } = row.original;
          return <Profile {...{ title: activity, caption: timePeriod, titleProps: { variant: 'body2' } }} />;
        }
      },
      {
        id: 'timePeriod',
        accessorKey: 'timePeriod',
        meta: { sx: { display: 'none' } }
      },
      {
        id: 'createdDate',
        accessorKey: 'createdDate',
        header: 'Date',
        filterFn: dateInRange,
        cell: ({ row }) => {
          const raw = row.original.createdDate;
          return raw ? formatDate(raw) : '-';
        }
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        filterFn: includesSome,
        cell: ({ row }) => {
          const { status } = row.original;
          return <Chip label={status} color={statusColor[status] || 'error'} size="small" />;
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
    data: users,
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
    // set rowId from data user
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
