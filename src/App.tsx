import { RouterProvider, matchRoute, useRouter } from './router';
import { AuthProvider, useAuth } from './lib/auth';
import { Navbar } from './components/Navbar';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { VideosPage } from './pages/VideosPage';
import { ContactPage } from './pages/ContactPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { LatestJobsPage } from './pages/LatestJobsPage';
import { PrivacyPolicyPage, DisclaimerPage, TermsPage, NotFoundPage } from './pages/StaticPages';
import { SitemapPage } from './pages/SitemapPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEditorPage } from './pages/admin/AdminEditorPage';
import { Loader2 } from 'lucide-react';

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
  if (path === '/privacy-policy') return <PrivacyPolicyPage />;
  if (path === '/disclaimer') return <DisclaimerPage />;
  if (path === '/terms') return <TermsPage />;
  if (path === '/sitemap.xml') return <SitemapPage />;
  const post = matchRoute('/blog/:slug', path);
  if (post) return <BlogPostPage slug={post.slug} />;
  return <NotFoundPage />;
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
  const editMatch = matchRoute('/admin/edit/:slug', path);
  if (editMatch) return <AdminEditorPage slug={editMatch.slug} />;
  if (path === '/admin/new') return <AdminEditorPage />;
  return <NotFoundPage />;
}

function Routes() {
  const { route } = useRouter();
  const path = route.path.split('?')[0];
  if (path === '/admin' || path === '/admin/login' || path === '/admin/new' || path.startsWith('/admin/')) return <AdminRoutes />;
  return (
    <>
      <Navbar />
      <BreakingNewsTicker />
      <main id="main-content" className="flex-1 animate-fade-in">
        <PublicRoutes />
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
