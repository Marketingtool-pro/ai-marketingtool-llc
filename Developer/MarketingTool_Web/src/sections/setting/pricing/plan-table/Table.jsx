import PropTypes from 'prop-types';
import { Fragment } from 'react';

// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// @third-party
import { flexRender } from '@tanstack/react-table';

// @project
import Toolbar from './Toolbar';
import MainCard from '@/components/MainCard';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import HeaderCell from '@/components/third-party/table/HeaderCell';

/***************************  TABLE - CARD  ***************************/

export default function TableCard({ table, onGlobalSearch }) {
  return (
    <MainCard sx={{ p: 0, borderRadius: 0, border: 'none' }}>
      <Toolbar onGlobalSearch={onGlobalSearch} />
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
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
                      </TableRow>
                    )}
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
    </MainCard>
  );
}

TableCard.propTypes = { table: PropTypes.object, onGlobalSearch: PropTypes.func };
