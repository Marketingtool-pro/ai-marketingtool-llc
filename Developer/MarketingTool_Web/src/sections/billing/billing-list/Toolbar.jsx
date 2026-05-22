import PropTypes from 'prop-types';
import { Fragment, useMemo } from 'react';

// @mui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { format } from 'date-fns';

// @project
import { handleBillingFilter, initialBillingFilter, useGetBillingFilter } from '../api';
import FilterSection from './Filter';
import { removeFilterItem } from '../FilterFn';
import DebouncedInput from '@/components/third-party/table/DebouncedInput';

// @assets
import { IconX } from '@tabler/icons-react';

const gap = 0.75;

/***************************  TABLE - TOOLBAR  ***************************/

export default function Toolbar({ onGlobalSearch }) {
  const { billingFilter } = useGetBillingFilter();
  const { columnFilters, globalFilter } = billingFilter || {};

  const filterSection = useMemo(() => <FilterSection />, []);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        alignItems: { xs: 'start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1, sm: 2 },
        px: { xs: 1.25, sm: 2.5 },
        py: 0.5,
        width: 1
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap, minWidth: { xs: 1, sm: 'fit-content' } }}>
        <DebouncedInput
          placeholder="Search here"
          value=""
          onValueChange={(data) => {
            if (globalFilter) handleBillingFilter({ ...billingFilter, globalFilter: data.toString() });
            onGlobalSearch(data);
          }}
          borderless
        />

        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>{filterSection}</Box>
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap,
          width: { xs: 1, sm: 'calc(100% - 263px)' },
          justifyContent: 'flex-end',
          display: { xs: 'flex' }
        }}
      >
        <Divider orientation="vertical" flexItem sx={{ height: 18, marginY: 'auto', display: { xs: 'none', sm: 'block' } }} />
        {((columnFilters && columnFilters.length > 0) || globalFilter) && (
          <>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                gap,
                flexWrap: 'nowrap',
                pt: 0.5,
                pb: 0.25,
                maxWidth: { xs: 'calc(100% - 42px)', sm: 'calc(100% - 174px)' },
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'secondary.light', borderRadius: '4px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'secondary.lighter', borderRadius: '4px' }
              }}
            >
              {globalFilter && (
                <Chip
                  label={globalFilter}
                  variant="tag"
                  sx={{ '&.Mui-focusVisible': { boxShadow: 'none', borderColor: 'grey.600' } }}
                  onDelete={() => handleBillingFilter({ ...billingFilter, globalFilter: '' })}
                />
              )}
              {columnFilters?.map((filter, index) => (
                <Fragment key={index}>
                  {typeof filter.value === 'string' && (
                    <Chip
                      label={filter.value}
                      variant="tag"
                      sx={{ '&.Mui-focusVisible': { boxShadow: 'none', borderColor: 'grey.600' } }}
                      onDelete={() => handleBillingFilter({ ...billingFilter, columnFilters: columnFilters.filter((f) => f !== filter) })}
                    />
                  )}
                  {Array.isArray(filter.value) &&
                    filter.value.map((item, index) => (
                      <Chip
                        key={filter.id + index}
                        label={item}
                        variant="tag"
                        sx={{ '&.Mui-focusVisible': { boxShadow: 'none', borderColor: 'grey.600' } }}
                        onDelete={() => handleBillingFilter(removeFilterItem(billingFilter, filter, item))}
                      />
                    ))}
                  {!Array.isArray(filter.value) && typeof filter.value === 'object' && (
                    <>
                      {Object.entries(filter.value).map(
                        ([key, value]) =>
                          value !== null && (
                            <Chip
                              key={key}
                              label={`${key}: ${format(String(value), 'dd MMM yyyy')}`}
                              variant="tag"
                              sx={{ textTransform: 'capitalize', '&.Mui-focusVisible': { boxShadow: 'none', borderColor: 'grey.600' } }}
                              onDelete={() => handleBillingFilter(removeFilterItem(billingFilter, filter, value))}
                            />
                          )
                      )}
                    </>
                  )}
                </Fragment>
              ))}
            </Stack>
            <Button color="error" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => handleBillingFilter(initialBillingFilter)}>
              Clear All
            </Button>
            <IconButton
              color="error"
              size="small"
              sx={{ display: { xs: 'block', sm: 'none' } }}
              aria-label="delete"
              onClick={() => handleBillingFilter(initialBillingFilter)}
            >
              <IconX size={16} />
            </IconButton>
          </>
        )}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{filterSection}</Box>
      </Stack>
    </Stack>
  );
}

Toolbar.propTypes = { onGlobalSearch: PropTypes.func };
