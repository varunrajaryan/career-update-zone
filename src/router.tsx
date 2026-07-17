import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';

type Route = { path: string };
type RouterContextValue = { route: Route; navigate: (to: string, opts?: { replace?: boolean }) => void };
const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const onHash = () => { setPath(window.location.hash.slice(1) || '/'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const target = '#' + to;
    if (opts?.replace) window.location.replace(target);
    else window.location.hash = to;
  }, []);
  return <RouterContext.Provider value={{ route: { path }, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function Link({ to, children, className, ...rest }: { to: string; children: ReactNode; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={'#' + to} className={className} {...rest}>{children}</a>;
}

export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const pParts = pattern.split('/').filter(Boolean);
  const aParts = path.split('?')[0].split('/').filter(Boolean);
  if (pParts.length !== aParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(aParts[i]);
    else if (pParts[i] !== aParts[i]) return null;
  }
  return params;
}
