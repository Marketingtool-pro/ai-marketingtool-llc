import { useMemo } from 'react';

// @third-party
import useSWR, { mutate } from 'swr';

// @project
import { users } from '../data/users';
import { attempt } from '@/utils/attempt';
import { generateId, getBase64 } from '@/utils/common';
import { offsetDate } from '@/utils/offsetDate';
// import axiosServices from '@/utils/axios';

// @types
import { Status } from '../type';

const endpoints = {
  key: 'api/users',
  list: '/list',
  filter: '/filter'
};

export const initialUserFilter = {
  /**
   *
   * Example of default `columnFilters` - [{ id: 'plan', value: [Plans.STARTER, Plans.ENTERPRISE] }]
   *
   **/
  columnFilters: [],
  globalFilter: ''
};

/***************************  GET - USER FILTER  ***************************/

export function useGetUserFilter() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.filter, () => initialUserFilter, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      userFilter: data,
      userFilterLoading: isLoading,
      userFilterError: error,
      userFilterValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  MANAGE - USER FILTER  ***************************/

export async function handleUserFilter(filter) {
  mutate(endpoints.key + endpoints.filter, () => filter, false);
}

/***************************  API - USER LIST  ***************************/

export function useGetUsers() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, () => users.reverse(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      users: data || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  API - USER CREATE  ***************************/

export async function createUser(formData) {
  const getField = (key) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };

  const avatarFile = formData.get('avatar');
  let avatar = '';
  if (avatarFile instanceof File) {
    avatar = await getBase64(avatarFile);
  }

  const newUser = {
    id: generateId(),
    avatar: avatar,
    firstName: getField('firstName'),
    lastName: getField('lastName'),
    username: getField('username'),
    email: getField('email'),
    zipCode: getField('zipCode'),
    address: getField('address'),
    dialCode: getField('dialCode'),
    contact: getField('contact'),
    role: getField('role'),
    status: getField('status'),
    createdDate: getField('createdDate'),
    activity: 'Created',
    timePeriod: 'now',
    loginDate: offsetDate(0)
  };

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentUsers = []) => {
        const safeUsers = Array.isArray(currentUsers) ? currentUsers : [];
        const latestUsers = [{ ...newUser }, ...safeUsers];

        return latestUsers;
      },
      false
    )
  );

  // to hit server
  // return attempt(
  //   axiosServices.post('/api/users/create', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // );
}

/***************************  API - USER UPDATE  ***************************/

export async function updateUser(formData) {
  const getField = (key) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };

  const avatarFile = formData.get('avatar');
  const updatedId = getField('id');

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      async (currentUsers = []) => {
        const updatedUsers = await Promise.all(
          currentUsers.map(async (user) => {
            if (user.id !== updatedId) return user;

            let updatedAvatar = user.avatar;

            if (avatarFile instanceof File) {
              updatedAvatar = await getBase64(avatarFile);
            } else if (!avatarFile) {
              updatedAvatar = '';
            }

            return {
              ...user,
              avatar: updatedAvatar,
              firstName: getField('firstName'),
              lastName: getField('lastName'),
              username: getField('username'),
              email: getField('email'),
              zipCode: getField('zipCode'),
              address: getField('address'),
              dialCode: getField('dialCode'),
              contact: getField('contact'),
              role: getField('role'),
              status: getField('status'),
              createdDate: getField('createdDate')
            };
          })
        );

        return updatedUsers;
      },
      false
    )
  );

  // to hit server
  // return attempt(
  //   axiosServices.put('/api/users/update', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // );
}

/***************************  API - USER BLOCK  ***************************/

export async function blockUser(id, isBlocked) {
  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentUsers = []) => {
        if (!currentUsers || !Array.isArray(currentUsers)) return [];

        const updatedUsers = currentUsers.map((user) =>
          user.id === id ? { ...user, status: isBlocked ? Status.BLOCKED : Status.ACTIVE } : user
        );

        return updatedUsers;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.patch('/api/users/block', { id, isBlocked }));
}

/***************************  API - USER DELETE  ***************************/

export async function deleteUser(ids) {
  const idList = Array.isArray(ids) ? ids : [ids];

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentUsers = []) => {
        if (!currentUsers || !Array.isArray(currentUsers)) return [];

        const remainingUsers = currentUsers.filter((user) => !idList.includes(user.id));

        return remainingUsers;
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.post('/api/users/delete', { ids }));
}
