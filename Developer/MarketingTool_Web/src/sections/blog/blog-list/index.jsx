import { useEffect, useMemo, useState } from 'react';

// @mui
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

// @third-party
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

// @project
import ActionCell from './ActionCell';
import { useGetBlogFilter, useGetBlogs } from '../api';
import BlogPublish from './BlogPublish';
import Table from './Table';

import Profile from '@/components/Profile';
import { dateInRange, globalFilterFn, includesSome, numberInRange } from '@/components/third-party/table/FilterFunctions';
import { formatDate } from '@/utils/date/formatters';
import { useRouter } from '@/utils/navigation';

const ellipsisTypography = {
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal'
};

/***************************  COMPONENT - TABLE  ***************************/

export default function BlogList() {
  const router = useRouter();
  const { blogs } = useGetBlogs();
  const { blogFilter } = useGetBlogFilter();

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState(blogFilter?.columnFilters || []);
  const [sorting, setSorting] = useState([]);

  const statusFilterFn = (row, columnId, filterValue) => {
    const isArchived = row.getValue(columnId);
    if (filterValue.includes('Published') && !isArchived) return true;
    if (filterValue.includes('Archived') && isArchived) return true;
    return false;
  };

  const draftFilterFn = (row, columnId, filterValue) => {
    const isDraft = row.getValue(columnId);

    if (filterValue.includes('Drafted') && isDraft) return true;
    if (filterValue.includes('Not Drafted') && !isDraft) return true;

    return false;
  };

  useEffect(() => {
    if (blogFilter) {
      setGlobalFilter(blogFilter?.globalFilter || '');
      setColumnFilters(blogFilter?.columnFilters || []);
    }
  }, [blogFilter]);

  const columns = useMemo(
    () => [
      {
        id: 'blog',
        accessorKey: 'blog',
        header: 'Blog Post',
        accessorFn: (row) => row.title,
        cell: ({ row }) => {
          const { id, title, caption, banner, isDraft } = row.original;

          return (
            <Box sx={{ position: 'relative' }}>
              <Profile
                {...{
                  avatar: banner?.url ? { src: banner.url, variant: 'rounded' } : { variant: 'rounded' },
                  title,
                  caption,
                  titleProps: {
                    variant: 'body2',
                    onClick: () => router.push(`/blog/detail/${id}`),
                    sx: { cursor: 'pointer', ...ellipsisTypography }
                  },
                  captionProps: { sx: ellipsisTypography },
                  sx: { gap: 1.5, maxWidth: 450 },
                  placeholderIfEmpty: true
                }}
              />
              {isDraft && (
                <Chip
                  label="Draft"
                  variant="filled"
                  color="info"
                  size="small"
                  sx={{ position: 'absolute', bottom: -10, left: -2, height: 'auto', width: 44 }}
                />
              )}
            </Box>
          );
        },
        meta: { sx: { minWidth: 300 } }
      },
      // set for global search, hide by columnVisibility `caption`: false
      { id: 'caption', accessorKey: 'caption', header: 'Caption' },
      // set for global search, hide by columnVisibility `username`: false
      { id: 'username', accessorKey: 'username', header: 'Username', accessorFn: (row) => row.profile?.username },
      {
        id: 'profile',
        accessorFn: (row) => `${row.profile?.firstName} ${row.profile.lastName}`,
        header: 'Author',
        cell: ({ row }) => {
          const { avatar, firstName, lastName, username } = row.original.profile;
          return (
            <Profile
              {...{
                avatar: { src: avatar },
                title: `${firstName} ${lastName}`,
                caption: username,
                sx: { gap: 1.5 }
              }}
            />
          );
        }
      },
      // set for isDraft column filter, hide by columnVisibility `categories`: false
      {
        id: 'isDraft',
        accessorKey: 'isDraft',
        header: 'IsDraft',
        filterFn: draftFilterFn
      },
      // set for category column filter, hide by columnVisibility `categories`: false
      {
        id: 'categories',
        accessorKey: 'categories',
        header: 'Category',
        filterFn: includesSome
      },
      {
        id: 'createdDate',
        accessorKey: 'createdDate',
        header: 'Created at',
        filterFn: dateInRange,
        cell: ({ row }) => {
          const raw = row.original.createdDate;
          return raw ? formatDate(raw) : '-';
        }
      },
      {
        id: 'visits',
        accessorFn: (row) => row.visits,
        header: 'Page Visitors',
        meta: { align: 'right' },
        filterFn: numberInRange
      },
      {
        id: 'isArchived',
        accessorKey: 'isArchived',
        header: 'Published?',
        cell: ({ row }) => <BlogPublish row={row.original} />,
        meta: { align: 'center' },
        filterFn: statusFilterFn
      },
      {
        id: 'action',
        cell: ({ row }) => <ActionCell row={row.original} />
      }
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const columnIds = useMemo(() => columns.map((col) => col.id).filter(Boolean), [columns]);

  const table = useReactTable({
    data: blogs,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility: { caption: false, username: false, categories: false, isDraft: false }
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => globalFilterFn(row, columnIds, filterValue),
    onColumnFiltersChange: setColumnFilters,
    filterFns: { includesSome, dateInRange, numberInRange, statusFilterFn, draftFilterFn },
    // set rowId from data blog
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  // Global filter search
  const onGlobalSearch = (globalFilter) => {
    setGlobalFilter(globalFilter);
  };

  return (
    <>
      <Table {...{ table, onGlobalSearch }} />
    </>
  );
}
