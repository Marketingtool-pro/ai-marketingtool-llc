import PropTypes from 'prop-types';

// @mui
import Stack from '@mui/material/Stack';
import MUIPagination from '@mui/material/Pagination';

/***************************  REACT TABLE - PANIGATION  ***************************/

export default function Pagination({ table }) {
  const handleChangePagination = (event, value) => {
    table.setPageIndex(value - 1);
  };

  return (
    <>
      {table.getRowModel().rows.length > 0 && (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
          <MUIPagination count={table.getPageCount()} page={table.getState().pagination.pageIndex + 1} onChange={handleChangePagination} />
        </Stack>
      )}
    </>
  );
}

Pagination.propTypes = { table: PropTypes.object };
