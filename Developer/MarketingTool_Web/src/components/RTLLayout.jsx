import PropTypes from 'prop-types';
import { useEffect } from 'react';

// @mui
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// @third-party
import rtlPlugin from 'stylis-plugin-rtl';

// @project
import { ThemeDirection } from '@/config';
import useConfig from '@/hooks/useConfig';

// @types

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin]
});

const ltrCache = createCache({
  key: 'mui'
});

/***************************  RTL LAYOUT  ***************************/

export default function RTLLayout({ children }) {
  const {
    state: { themeDirection }
  } = useConfig();

  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  return <CacheProvider value={themeDirection === ThemeDirection.RTL ? rtlCache : ltrCache}>{children}</CacheProvider>;
}

RTLLayout.propTypes = { children: PropTypes.any };
