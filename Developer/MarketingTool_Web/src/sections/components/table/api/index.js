import { useMemo } from 'react';

// @third-party
import useSWR, { mutate } from 'swr';

// @project
import { persons } from '../data/persons';
import { attempt } from '@/utils/attempt';
// import axiosServices from '@/utils/axios';

// @types
import { Status, Plans } from '../type';

const endpoints = {
  key: 'api/persons',
  list: '/list',
  filter: '/filter'
};

export const initialPersonFilter = {
  /**
   *
   * Example of default `columnFilters` - [{ id: 'plan', value: [Plans.STARTER, Plans.ENTERPRISE] }]
   *
   **/
  columnFilters: [
    { id: 'plan', value: [Plans.FREE, Plans.BASIC] },
    { id: 'progress', value: [15, 95] }
  ],
  globalFilter: ''
};

/***************************  GET - PERSON FILTER  ***************************/

export function useGetPersonFilter() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.filter, () => initialPersonFilter, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      personFilter: data,
      personFilterLoading: isLoading,
      personFilterError: error,
      personFilterValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  MANAGE - PERSON FILTER  ***************************/

export async function handlePersonFilter(filter) {
  mutate(endpoints.key + endpoints.filter, () => filter, false);
}

/***************************  API - PERSON LIST  ***************************/

export function useGetPersons() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, () => persons.reverse(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      persons: data || [],
      personsLoading: isLoading,
      personsError: error,
      personsValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  API - PERSON BLOCK  ***************************/

export async function blockPerson(id, isBlocked) {
  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentPersons = []) => {
        if (!currentPersons || !Array.isArray(currentPersons)) return [];

        const updatedPersons = currentPersons.map((person) =>
          person.id === id ? { ...person, status: isBlocked ? Status.BLOCKED : Status.ACTIVE } : person
        );

        return updatedPersons;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.patch('/api/persons/block', { id, isBlocked }));
}

/***************************  API - PERSON PUBLIC  ***************************/

export async function publicProfile(id, isPublic) {
  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentPersons = []) => {
        if (!currentPersons || !Array.isArray(currentPersons)) return [];

        const updatedPersons = currentPersons.map((person) => (person.id === id ? { ...person, isPublic } : person));

        return updatedPersons;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.patch('/api/persons/public', { id, isPublic }));
}

/***************************  API - PERSON DELETE  ***************************/

export async function deletePerson(ids) {
  const idList = Array.isArray(ids) ? ids : [ids];

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentPersons = []) => {
        if (!currentPersons || !Array.isArray(currentPersons)) return [];

        const remainingPersons = currentPersons.filter((person) => !idList.includes(person.id));

        return remainingPersons;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.post('/api/persons/delete', { ids }));
}
