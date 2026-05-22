import { useMemo } from 'react';

// @third-party
import useSWR, { mutate } from 'swr';

// @project
import { billings } from '../data/billings';

const endpoints = {
  key: 'api/billings',
  list: '/list',
  filter: '/filter'
};

export const initialBillingFilter = {
  /**
   *
   * Example of default `columnFilters` - [{ id: 'plan', value: [Plans.STARTER, Plans.ENTERPRISE] }]
   *
   **/
  columnFilters: [],
  globalFilter: ''
};

/***************************  GET - BILLING FILTER  ***************************/

export function useGetBillingFilter() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.filter, () => initialBillingFilter, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      billingFilter: data,
      billingFilterLoading: isLoading,
      billingFilterError: error,
      billingFilterValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  MANAGE - BILLING FILTER  ***************************/

export async function handleBillingFilter(filter) {
  mutate(endpoints.key + endpoints.filter, () => filter, false);
}

/***************************  API - BILLING LIST  ***************************/

export function useGetBillings() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, () => billings.reverse(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      billings: data || [],
      billingsLoading: isLoading,
      billingsError: error,
      billingsValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
