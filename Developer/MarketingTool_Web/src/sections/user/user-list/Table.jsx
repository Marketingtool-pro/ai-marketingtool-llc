import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef, useState } from 'react';

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
import RowDetails from './RowDetails';
import Toolbar from './Toolbar';
import MainCard from '@/components/MainCard';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import HeaderCell from '@/components/third-party/table/HeaderCell';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import Pagination from '@/components/third-party/table/Pagination';

/***************************  TABLE - CARD  ***************************/

export default function TableCard({ table, onGlobalSearch }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <PageAnimateWrapper>
      <MainCard sx={{ p: 0 }}>
        <Toolbar {...{ table, onGlobalSearch }} filterHeight={table.getRowModel().rows.length > 0 ? height : height - 65} />
        <TableContainer ref={ref}>
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
                          <TableCell colSpan={row.getVisibleCells().length - 2} sx={{ p: 2.5, color: 'text.primary' }}>
                            <RowDetails data={row.original} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} sx={{ height: 420 }}>
                    <EmptyTable msg="No Data" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination table={table} />
      </MainCard>
    </PageAnimateWrapper>
  );
}

TableCard.propTypes = { table: PropTypes.object, onGlobalSearch: PropTypes.func };
