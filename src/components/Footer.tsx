import { Link } from '../router';
import { channel } from '../content/channel';
import { Video, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-400">
      <div className="container-content py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white"><Video className="h-4 w-4" aria-hidden="true" /></span>
              <span className="font-display text-base font-bold text-white">{channel.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{channel.tagline}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/latest-jobs" className="hover:text-white transition">Latest Jobs</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/videos" className="hover:text-white transition">Videos</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition"><Video className="h-4 w-4" aria-hidden="true" /> YouTube</a></li>
              <li><a href={`mailto:${channel.email}`} className="flex items-center gap-2 hover:text-white transition"><Mail className="h-4 w-4" aria-hidden="true" /> {channel.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-ink-800 pt-6 text-xs">
          <p>&copy; {new Date().getFullYear()} {channel.name}. All rights reserved.</p>
          <div className="mt-2 flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/disclaimer" className="hover:text-white">Disclaimer</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
