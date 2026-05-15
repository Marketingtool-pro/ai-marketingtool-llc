import { useMemo, useState } from 'react';

// @mui
import Chip from '@mui/material/Chip';

// @third-party
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

// @project
import Profile from '@/components/Profile';
import AvatarGroup from '@/components/third-party/table/AvatarGroup';
import { globalFilterFn } from '@/components/third-party/table/FilterFunctions';

import { billingPeriodsOptions, pricingModals, pricingPlanData } from '@/sections/setting/pricing/data/plan-data';
import { Table, ActionCell } from '@/sections/setting/pricing/plan-table';

export function getBillingPeriodTitles(selectedPeriods, billingOptions) {
  return billingOptions
    .filter((item) => selectedPeriods.includes(item.value))
    .map((item) => item.title)
    .join(', ');
}

/***************************  COMPONENT - TABLE  ***************************/

export default function PricingPlanTable() {
  const [data, setData] = useState([...pricingPlanData]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        id: 'plan',
        accessorKey: 'name',
        header: 'Pricing Plan',
        cell: ({ row }) => {
          const { name, description, isRecommended } = row.original;
          return (
            <Profile
              {...{
                title: name,
                caption: description,
                ...(isRecommended && { label: <Chip label="Recommended" color="primary" size="small" /> }),
                sx: { gap: 1.5 }
              }}
            />
          );
        }
      },
      // set for description column filter, hide by columnVisibility `description`: false
      {
        id: 'description',
        accessorKey: 'description'
      },
      {
        id: 'model',
        header: 'Pricing Model',
        accessorFn: (row) => {
          return pricingModals.find((item) => item.value === row.priceModal)?.title ?? '';
        },
        cell: ({ row }) => {
          const { priceModal, pricingOptions } = row.original;
          const modalTitle = pricingModals.find((item) => item.value === priceModal)?.title ?? '';
          const selectedPeriods = pricingOptions.map((x) => x.period);
          const periodTitles = getBillingPeriodTitles(selectedPeriods, billingPeriodsOptions);

          return <Profile title={modalTitle} caption={periodTitles} />;
        }
      },
      {
        id: 'users',
        accessorKey: 'users',
        header: 'Subscriber',
        cell: ({ row }) => <AvatarGroup list={row.original.users} max={5} />
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const { isDraft } = row.original;

          return <Chip label={isDraft ? 'Draft' : 'Published'} size="small" color={isDraft ? 'warning' : 'success'} />;
        }
      },
      // set for isDraft column filter, hide by columnVisibility `isDraft`: false
      {
        id: 'isDraft',
        accessorKey: 'isDraft',
        accessorFn: (row) => (row.isDraft ? 'draft' : 'published')
      },
      // set for pricingOptions column filter, hide by columnVisibility `pricingOptions`: false
      {
        id: 'pricingOptions',
        accessorFn: (row) => {
          const selectedPeriods = row.pricingOptions.map((x) => x.period);
          return getBillingPeriodTitles(selectedPeriods, billingPeriodsOptions);
        }
      },
      {
        id: 'action',
        cell: ({ row }) => <ActionCell row={row.original} onDelete={(id) => onDeleteRow(id)} />
      }
    ],
    []
  );

  const columnIds = useMemo(() => columns.map((col) => col.id).filter(Boolean), [columns]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility: { description: false, isDraft: false, pricingOptions: false } },
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
