import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

// @project
import { features, plans } from '../data/features-data';
import DynamicIcon from '@/components/DynamicIcon';
import globalFilterFn from '@/components/third-party/table/globalFilterFn';
import { Table, ActionCell } from '@/sections/setting/pricing/feature-table';

const iconSize = 16;

/***************************  TABLE - ICON LABEL  ***************************/

function IconLabel({ icon, iconColor, title }) {
  return (
    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
      <Box sx={{ width: iconSize, height: iconSize }}>
        <DynamicIcon name={icon} color={iconColor} size={iconSize} />
      </Box>
      <>{title}</>
    </Stack>
  );
}

/***************************  COMPONENT - TABLE  ***************************/

export default function TableComponent() {
  const theme = useTheme();

  const [data, setData] = useState([...features]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => {
      const planColumns = plans.map((plan) => ({
        id: plan.title,
        accessorKey: plan.title,
        header: plan.title,
        accessorFn: (row) => {
          const planFeature = plan.features.find((f) => f.id === row.id);
          return planFeature?.value || '';
        },
        cell: ({ getValue }) => {
          const value = getValue();
          const icon = value ? 'IconCircleCheck' : 'IconXboxX';
          const iconColor = value ? theme.vars.palette.success.main : theme.vars.palette.grey[600];

          return <IconLabel icon={icon} iconColor={iconColor} title={value || 'Not Available'} />;
        }
      }));

      return [
        {
          id: 'name',
          accessorKey: 'name',
          header: 'Name',
          cell: ({ row }) => <Typography variant="subtitle2">{row.original.name}</Typography>
        },
        ...planColumns,
        {
          id: 'action',
          cell: ({ row }) => <ActionCell row={row.original} onDelete={(id) => onDeleteRow(id)} />
        }
      ];
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };

  // Global filter search
  const onGlobalSearch = (globalFilter) => {
    setGlobalFilter(globalFilter);
  };

  return <Table table={table} onGlobalSearch={onGlobalSearch} />;
}

IconLabel.propTypes = { icon: PropTypes.any, iconColor: PropTypes.string, title: PropTypes.string };
