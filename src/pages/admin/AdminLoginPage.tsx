import { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Video, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Seo } from '../../components/Seo';
import { channel } from '../../content/channel';
import { Link } from '../../router';

export function AdminLoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error && typeof result.error === 'string' && result.error.length > 0) setErrorMsg(result.error);
  }

  return (
    <>
      <Seo title="Admin Login" description="Admin login for Career Update Zone CMS." canonical="/admin/login" noindex />
      <div className="relative grid min-h-screen place-items-center bg-ink-950 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.pexels.com/photos/5905702/pexels-photo-5702.jpeg" alt="" width={1920} height={1080} className="h-full w-full object-cover opacity-15" />
        </div>
        <Link to="/" className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white sm:left-6 sm:top-6"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Website</Link>
        <div className="relative w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur"><Video className="h-7 w-7 text-brand-500" aria-hidden="true" /></span>
            <h1 className="mt-4 font-display text-2xl font-bold text-white">{channel.name}</h1>
            <p className="mt-1 text-sm text-ink-400">Sign in to manage your content</p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            {errorMsg.length > 0 && <div className="mb-5 flex items-start gap-2 rounded-xl bg-error-500/10 px-4 py-3 text-sm text-error-500" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>{errorMsg}</span></div>}
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-300">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-ink-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
              </div>
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ink-300">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-ink-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none" />
              </div>
            </label>
            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-50">{loading ? 'Please wait…' : 'Sign in'}{!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}</button>
          </form>
          <p className="mt-6 text-center text-xs text-ink-500">Authorized personnel only. All actions are logged.</p>
        </div>
      </div>
    </>
  );
}
