import PropTypes from 'prop-types';
import { useEffect } from 'react';

// @third-party
import { SWRConfig, useSWRConfig } from 'swr';

// @project
import { setMutateContext } from './mutate-bound';

export const swrCache = new Map();

/***************************  SWR - PROVIDER  ***************************/

export default function SWRProvider({ children }) {
  return (
    <SWRConfig value={{ provider: () => swrCache }}>
      <RegisterMutate />
      {children}
    </SWRConfig>
  );
}

function RegisterMutate() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setMutateContext(mutate); // Save mutate globally
  }, [mutate]);

  return null;
}

SWRProvider.propTypes = { children: PropTypes.node };
