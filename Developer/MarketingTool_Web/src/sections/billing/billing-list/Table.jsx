import PropTypes from 'prop-types';
import { Fragment } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// @third-party
import { flexRender } from '@tanstack/react-table';

// @project
import Toolbar from './Toolbar';
import MainCard from '@/components/MainCard';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import HeaderCell from '@/components/third-party/table/HeaderCell';
import Pagination from '@/components/third-party/table/Pagination';

// @assets
import { IconBan } from '@tabler/icons-react';

/***************************  TABLE - CARD  ***************************/

export default function TableCard({ table, onGlobalSearch }) {
  return (
    <>
      <MainCard sx={{ p: 0 }}>
        <Toolbar {...{ onGlobalSearch }} />
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <HeaderCell key={header.id} header={header} />
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => {
                  const isItemSelected = table
                    .getSelectedRowModel()
                    .rows.map((item) => item.original.id)
                    .includes(row.original.id);

                  return (
                    <Fragment key={row.id}>
                      <TableRow hover selected={isItemSelected}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    </Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} sx={{ height: 300 }}>
                    <EmptyTable msg="No Data" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination table={table} />
      </MainCard>
      <Stack direction="row" sx={{ gap: 0.5, color: 'error.main', alignItems: 'center' }}>
        <IconBan size={14} />
        <Typography color="grey.700" variant="caption1">
          This icon represents customer who are currently blocked.
        </Typography>
      </Stack>
    </>
  );
}

TableCard.propTypes = { table: PropTypes.object, onGlobalSearch: PropTypes.func };
