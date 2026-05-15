import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardSummary } from '@/utils/api/windmill';

let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

export default function useDashboardData() {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardSummary();
      if (result && typeof result === 'object') {
        cachedData = result;
        cacheTime = Date.now();
        setData(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch when ad accounts are connected (check localStorage)
    const connected = localStorage.getItem('fb_ads_connected') === 'true';
    if (connected && (!cachedData || Date.now() - cacheTime > CACHE_TTL)) {
      refresh();
    }
  }, [refresh]);

  const hasData = data?.hasData === true;

  return { data, loading, error, hasData, refresh };
}
