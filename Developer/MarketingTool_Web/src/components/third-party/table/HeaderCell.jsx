import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

// @third-party
import { flexRender } from '@tanstack/react-table';

// @project
import HeaderSort from './HeaderSort';

// @assets
import { IconHelp } from '@tabler/icons-react';

/***************************  REACT TABLE - HEADER CELL  ***************************/

export default function HeaderCell({ header, tooltip }) {
  const theme = useTheme();

  return (
    <TableCell {...header.column.columnDef.meta}>
      {header.isPlaceholder ? null : (
        <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', whiteSpace: 'nowrap' }}>
          {flexRender(header.column.columnDef.header, header.getContext())}
          {tooltip && (
            <Tooltip title={tooltip}>
              <IconHelp size={16} color={theme.vars.palette.grey[700]} />
            </Tooltip>
          )}
          {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
        </Stack>
      )}
    </TableCell>
  );
}

HeaderCell.propTypes = { header: PropTypes.object, tooltip: PropTypes.string };
