import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const sanitizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.toLowerCase().startsWith('javascript:')) {
      return 'about:blank';
    }
    return trimmed;
  };

  const push = (path) => {
    try {
      const appOrigin = window.location.origin;
      const url = new URL(path, appOrigin);

      if (url.origin === appOrigin) {
        // Internal route: use SPA navigation
        navigate(url.pathname + url.search + url.hash);
      } else {
        // External URL: full page reload
        window.location.href = sanitizeUrl(path);
      }
    } catch {
      // Fallback: assume it's relative
      navigate(path);
    }
  };

  const replace = (path) => {
    try {
      const appOrigin = window.location.origin;
      const url = new URL(path, appOrigin);

      if (url.origin === appOrigin) {
        navigate(url.pathname + url.search + url.hash, { replace: true });
      } else {
        window.location.replace(sanitizeUrl(path));
      }
    } catch {
      navigate(path, { replace: true });
    }
  };

  return {
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    asPath: location.pathname + location.search,
    push,
    replace,
    back: () => navigate(-1),
    params
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  return {
    get: (key) => searchParams.get(key),
    set: (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, value);
      navigate(`${location.pathname}?${newParams.toString()}`);
    }
  };
}
