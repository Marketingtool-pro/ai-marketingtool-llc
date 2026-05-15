import PropTypes from 'prop-types';
import { createContext, useMemo } from 'react';

// @project
import config from '@/config';
import useLocalStorage from '@/hooks/useLocalStorage';

// @types

/***************************  CONFIG CONTEXT  ***************************/

export const ConfigContext = createContext(undefined);

/***************************  CONFIG PROVIDER  ***************************/

export function ConfigProvider({ children }) {
  const { state, setState, setField, resetState } = useLocalStorage('mt-admin-config', config);

  const memoizedValue = useMemo(() => ({ state, setState, setField, resetState }), [state, setField, setState, resetState]);

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
}

ConfigProvider.propTypes = { children: PropTypes.any };
