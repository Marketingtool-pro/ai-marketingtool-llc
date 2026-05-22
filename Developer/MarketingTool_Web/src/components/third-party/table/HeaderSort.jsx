import PropTypes from 'prop-types';
// @mui
import { useColorScheme, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

// @project
import { ThemeMode } from '@/config';

// @assets
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

var SortType;

(function (SortType) {
  SortType['ASC'] = 'asc';
  SortType['DESC'] = 'desc';
})(SortType || (SortType = {}));

/***************************  HEADER SORT - TOGGLER  ***************************/

function SortToggler({ type }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const iconColor = colorScheme === ThemeMode.DARK ? theme.vars.palette.grey[600] : theme.vars.palette.grey[500];

  return (
    <>
      {(!type || type === SortType.ASC) && (
        <IconArrowUp size={16} color={type === SortType.ASC ? theme.vars.palette.grey[700] : iconColor} />
      )}
      {type === SortType.DESC && <IconArrowDown size={16} color={theme.vars.palette.grey[700]} />}
    </>
  );
}

/***************************  REACT TABLE - HEADER SORT  ***************************/

export default function HeaderSort({ column, sort }) {
  return (
    <Stack {...(sort && { onClick: column.getToggleSortingHandler(), sx: { cursor: 'pointer' } })}>
      {{
        asc: <SortToggler type={SortType.ASC} />,
        desc: <SortToggler type={SortType.DESC} />
      }[column.getIsSorted()] ?? <SortToggler />}
    </Stack>
  );
}

SortToggler.propTypes = { type: PropTypes.any };

HeaderSort.propTypes = { column: PropTypes.object, sort: PropTypes.bool };
