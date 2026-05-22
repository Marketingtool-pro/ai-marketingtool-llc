import { RouterProvider } from 'react-router-dom';

// @project
import Locales from '@/components/Locales';
import RTLLayout from '@/components/RTLLayout';
import Snackbar from '@/components/Snackbar';
import Notistack from '@/components/third-party/Notistack';
import { ConfigProvider } from '@/contexts/ConfigContext';

import Metrics from '@/metrics';
import router from '@/routes';
import ThemeCustomization from '@/themes';

function App() {
  return (
    <>
      <ConfigProvider>
        <ThemeCustomization>
          <RTLLayout>
            <Locales>
              <Notistack>
                <RouterProvider router={router} />
                <Snackbar />
              </Notistack>
            </Locales>
          </RTLLayout>
        </ThemeCustomization>
      </ConfigProvider>
      <Metrics />
    </>
  );
}

export default App;
