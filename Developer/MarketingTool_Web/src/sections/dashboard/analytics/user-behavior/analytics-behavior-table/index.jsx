import { useMemo, useState } from 'react';

// @mui
import Chip from '@mui/material/Chip';

// @third-party
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

// @project
import ActionCell from './ActionCell';
import { analyticsBehaviorTableData } from './data';
import Table from './Table';
import Profile from '@/components/Profile';
import globalFilterFn from '@/components/third-party/table/globalFilterFn';

/***************************  CHIP - STATUS COLOR  ***************************/

const statusColor = {
  success: { label: 'Success', color: 'success' },
  cancel: { label: 'Cancel', color: 'error' }
};

/***************************  COMPONENT - TABLE  ***************************/

export default function AnalyticsBehaviorTable({ data: externalData }) {
  const [data, setData] = useState(externalData || [...analyticsBehaviorTableData]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        id: 'user',
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => {
          const { src, name } = row.original.user;
          return <Profile {...{ avatar: { src }, title: name, sx: { gap: 1.5 } }} />;
        }
      },
      { id: 'amount', accessorKey: 'amount', header: 'Amount', meta: { align: 'right' } },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const { status } = row.original;
          const { label, color } = statusColor[status] || statusColor['success'];

          return <Chip label={label} color={color} size="small" />;
        }
      },
      {
        id: 'dateTime',
        accessorKey: 'dateTime',
        header: 'Date',
        cell: ({ row }) => {
          const { time, date } = row.original.dateTime;
          return <Profile {...{ title: date, caption: time, titleProps: { variant: 'body2' } }} />;
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
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => globalFilterFn(row, columnIds, filterValue),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  // Delete single row by id from dialog
  const onDeleteRow = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    console.log('User deleted', data);
  };

  // Global filter search
  const onGlobalSearch = (globalFilter) => {
    setGlobalFilter(globalFilter);
  };

  return <Table table={table} onGlobalSearch={onGlobalSearch} />;
}
