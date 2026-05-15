import { useEffect, useMemo, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

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
import { useGetPersonFilter, useGetPersons } from '../api';
import ActionCell from './ActionCell';
import PublicPerson from './PublicPerson';
import Table from './Table';

import Profile from '@/components/Profile';
import LinearProgressWithLabel, { LinearProgressType } from '@/components/progress/LinearProgressWithLabel';
import AvatarGroup from '@/components/third-party/table/AvatarGroup';
import { dateInRange, globalFilterFn, includesSome } from '@/components/third-party/table/FilterFunctions';
import { resetRowSelection } from '@/components/third-party/table/RowSelectionFn';
import TagList from '@/components/third-party/table/TagList';
import { formatDate } from '@/utils/date/formatters';

// @types
import { Status } from '../type';

// @assets
import { IconBan, IconCancel, IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/***************************  CHIP - STATUS COLOR  ***************************/

const statusColor = {
  Active: 'success',
  Pending: 'warning',
  Reported: 'primary',
  Blocked: 'error'
};

/***************************  COMPONENT - TABLE  ***************************/

export default function PersonList() {
  const { persons } = useGetPersons();
  const { personFilter } = useGetPersonFilter();

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState(personFilter?.columnFilters || []);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    if (personFilter) {
      setGlobalFilter(personFilter?.globalFilter || '');
      setColumnFilters(personFilter?.columnFilters || []);
    }
  }, [personFilter]);

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
        id: 'isPublic',
        accessorKey: 'isPublic',
        header: 'Public?',
        cell: ({ row }) => <PublicPerson row={row.original} />,
        meta: { align: 'center' }
      },
      {
        id: 'profile',
        header: 'Profile',
        cell: ({ row }) => {
          const { avatar, firstName, lastName, caption, personname, status } = row.original;
          return (
            <Profile
              {...{
                avatar: {
                  src: avatar
                },
                title: `${firstName} ${lastName}`,
                caption: personname,
                ...(caption && { label: <Chip size="small" label={caption} color="info" /> }),
                ...(status === Status.BLOCKED && {
                  label: (
                    <Tooltip title="Blocked">
                      <IconBan size={14} />
                    </Tooltip>
                  )
                }),
                titleProps: { color: 'text.primary' },
                sx: { gap: 1.5, '& svg': { color: 'error.main' } }
              }}
            />
          );
        },
        accessorFn: (row) => `${row.firstName} ${row.lastName}`
      },
      { id: 'role', accessorKey: 'role', header: 'Role', filterFn: includesSome },
      {
        id: 'skills',
        accessorKey: 'skills',
        header: 'Skills',
        filterFn: includesSome,
        cell: (info) => <TagList list={info.row.original.skills} />
      },
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
        id: 'followers',
        accessorKey: 'followers',
        header: 'Followers',
        cell: ({ row }) => (row.original.followers ? <AvatarGroup list={row.original.followers} max={3} /> : '-'),
        meta: { align: 'right' }
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
      // `accessorFn` - set column with plan `name`
      { id: 'plan', header: 'Plan', accessorFn: (row) => row.plan.name, filterFn: includesSome, meta: { sx: { display: 'none' } } },
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
        id: 'progress',
        header: 'Profile Progress',
        accessorKey: 'progress',
        cell: ({ row }) => (
          <LinearProgressWithLabel
            value={row.original.progress}
            sx={{ height: 8 }}
            type={LinearProgressType.LIGHT}
            aria-label="Profile Progress"
          />
        )
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
    data: persons,
    columns,
    state: { rowSelection, sorting, globalFilter, columnFilters, columnVisibility: { personname: false } },
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
    // set rowId from data person
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
