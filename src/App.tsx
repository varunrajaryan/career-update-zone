import { lazy, Suspense } from 'react';
import { RouterProvider, matchRoute, useRouter } from './router';
import { AuthProvider, useAuth } from './lib/auth';
import { Navbar } from './components/Navbar';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { Loader2 } from 'lucide-react';

const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const VideosPage = lazy(() => import('./pages/VideosPage').then((m) => ({ default: m.VideosPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const LatestJobsPage = lazy(() => import('./pages/LatestJobsPage').then((m) => ({ default: m.LatestJobsPage })));
const StaticPages = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.StaticPages })));
const SitemapPage = lazy(() => import('./pages/SitemapPage').then((m) => ({ default: m.SitemapPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminEditorPage = lazy(() => import('./pages/admin/AdminEditorPage').then((m) => ({ default: m.AdminEditorPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

const ADMIN_EMAIL = 'varunrajaryan@gmail.com';

function PublicRoutes() {
  const { route } = useRouter();
  const path = route.path.split('?')[0];
  if (path === '/') return <HomePage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/blog') return <BlogPage />;
  if (path === '/videos') return <VideosPage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/categories') return <CategoriesPage />;
  if (path === '/latest-jobs') return <LatestJobsPage />;
  if (path === '/privacy-policy') return <StaticPages page="privacy" />;
  if (path === '/disclaimer') return <StaticPages page="disclaimer" />;
  if (path === '/terms') return <StaticPages page="terms" />;
  if (path === '/sitemap.xml') return <SitemapPage />;
  const post = matchRoute('/blog/:slug', path);
  if (post) return <BlogPostPage slug={post.slug} />;
  return <StaticPages page="notfound" />;
}

function AdminRoutes() {
  const { route, navigate } = useRouter();
  const { session, loading, signOut } = useAuth();
  const path = route.path.split('?')[0];
  if (loading) return <div className="grid min-h-screen place-items-center bg-ink-50"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  if (path === '/admin/login') {
    if (session) { navigate('/admin', { replace: true }); return null; }
    return <AdminLoginPage />;
  }
  if (!session) { navigate('/admin/login', { replace: true }); return null; }
  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 px-4">
        <div className="card max-w-md p-8 text-center">
          <h1 className="font-display text-xl font-bold text-ink-950">Access Denied</h1>
          <p className="mt-2 text-sm text-ink-500">This account does not have admin privileges.</p>
          <button onClick={async () => { await signOut(); navigate('/admin/login', { replace: true }); }} className="btn-primary mt-6">Back to Login</button>
        </div>
      </div>
    );
  }
  if (path === '/admin') return <AdminDashboardPage />;
  if (path === '/admin/settings') return <AdminSettingsPage />;
  const editMatch = matchRoute('/admin/edit/:slug', path);
  if (editMatch) return <AdminEditorPage slug={editMatch.slug} />;
  if (path === '/admin/new') return <AdminEditorPage />;
  return <StaticPages page="notfound" />;
}

function Routes() {
  const { route } = useRouter();
  const path = route.path.split('?')[0];
  if (path === '/admin' || path === '/admin/login' || path === '/admin/new' || path.startsWith('/admin/')) {
    return (
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-ink-50"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>}>
        <AdminRoutes />
      </Suspense>
    );
  }
  return (
    <>
      <Navbar />
      <BreakingNewsTicker />
      <main id="main-content" className="flex-1 animate-fade-in">
        <Suspense fallback={null}>
          <PublicRoutes />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
          <Routes />
        </div>
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
