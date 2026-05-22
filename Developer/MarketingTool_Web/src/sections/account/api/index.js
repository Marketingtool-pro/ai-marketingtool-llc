import { useMemo } from 'react';

// @third-party
import useSWR, { mutate } from 'swr';

// @project
import { accounts } from '../data/accounts';
import { attempt } from '@/utils/attempt';

const endpoints = {
  key: 'api/accounts',
  list: '/list',
  filter: '/filter'
};

export const initialAccountFilter = {
  /**
   *
   * Example of default `columnFilters` - [{ id: 'plan', value: [Plans.STARTER, Plans.ENTERPRISE] }]
   *
   **/
  columnFilters: [],
  globalFilter: ''
};

/***************************  ACCOUNT PROFILE - ERROR BOUNDARY  ***************************/

export const accountLoader = () => {
  // Define the SWR key based on the route parameter
  const swrKey = endpoints.key + endpoints.list;
  return swrKey;
};

/***************************  GET - ACCOUNT FILTER  ***************************/

export function useGetAccountFilter() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.filter, () => initialAccountFilter, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      accountFilter: data,
      accountFilterLoading: isLoading,
      accountFilterError: error,
      accountFilterValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  MANAGE - ACCOUNT FILTER  ***************************/

export async function handleAccountFilter(filter) {
  mutate(endpoints.key + endpoints.filter, () => filter, false);
}

/***************************  API - ACCOUNT LIST  ***************************/

export function useGetAccounts(swrKey) {
  const { data, isLoading, error, isValidating } = useSWR(swrKey, () => accounts.reverse(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      accounts: data || [],
      accountsLoading: isLoading,
      accountsError: error,
      accountsValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  API - ACCOUNT CREATE  ***************************/

export async function createAccount(data) {
  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentAccounts = []) => {
        const safeAccounts = Array.isArray(currentAccounts) ? currentAccounts : [];
        const latestAccounts = [{ ...data, id: `${Date.now()}-${Math.random()}`, createdDate: new Date() }, ...safeAccounts];

        return latestAccounts;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.post('/api/accounts/create', data));
}

/***************************  API - ACCOUNT UPDATE  ***************************/

export async function updateAccount(data) {
  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentAccounts = []) => {
        const updatedAccounts = currentAccounts.map((account) => (account.id === data.id ? { ...account, ...data } : account));

        return updatedAccounts;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.post('/api/accounts/update', data));
}

/***************************  API - ACCOUNT BLOCK  ***************************/

export async function blockAccount(id, isBlocked) {
  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentAccounts = []) => {
        if (!currentAccounts || !Array.isArray(currentAccounts)) return [];

        const updatedAccounts = currentAccounts.map((account) => (account.id === id ? { ...account, isBlocked } : account));

        return updatedAccounts;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.post('/api/accounts/block', { id, isBlocked }));
}

/***************************  API - ACCOUNT DELETE  ***************************/

export async function deleteAccount(ids) {
  const idList = Array.isArray(ids) ? ids : [ids];

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentAccounts = []) => {
        if (!currentAccounts || !Array.isArray(currentAccounts)) return [];

        const remainingAccounts = currentAccounts.filter((account) => !idList.includes(account.id));

        return remainingAccounts;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.post('/api/accounts/delete', { ids }));
}
