import PropTypes from 'prop-types';
import { Activity, useEffect, useState } from 'react';

// @third-party
import { IntlProvider } from 'react-intl';

// @project
import { ThemeI18n } from '@/config';
import useConfig from '@/hooks/useConfig';

// @locales
const loadLocaleData = (locale) => {
  switch (locale) {
    case ThemeI18n.FR:
      return import('@/utils/locales/fr.json');
    case ThemeI18n.RO:
      return import('@/utils/locales/ro.json');
    case ThemeI18n.ZH:
      return import('@/utils/locales/zh.json');
    case ThemeI18n.EN:
    default:
      return import('@/utils/locales/en.json');
  }
};

/***************************  LOCALIZATION  ***************************/

export default function Locales({ children }) {
  const {
    state: { i18n }
  } = useConfig();

  const [messages, setMessages] = useState();

  useEffect(() => {
    loadLocaleData(i18n).then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <Activity mode={messages ? 'visible' : 'hidden'}>
      <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
        {children}
      </IntlProvider>
    </Activity>
  );
}

Locales.propTypes = { children: PropTypes.any };
