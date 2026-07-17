import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useYouTubeChannel } from '../lib/useYouTube';
import { channel } from '../content/channel';
import { formatNumber } from '../lib/editor-utils';
import { Users, Eye, Video, Mail, Target, Award } from 'lucide-react';

export function AboutPage() {
  const { data: yt } = useYouTubeChannel();
  return (
    <>
      <Seo title="About" description={`About ${channel.name} — ${channel.tagline}`} canonical="/about" />
      <div className="border-b border-ink-100 bg-white">
        <div className="container-content py-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950">About Us</h1>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-950">Who We Are</h2>
            <p className="mt-4 text-ink-600 leading-relaxed">{channel.description}</p>
            <p className="mt-4 text-ink-600 leading-relaxed">Our mission is to bridge the gap between job seekers and government employment opportunities by providing timely, accurate, and well-organized information. We strive to be the first place you check for any Sarkari job update.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="card p-5"><Target className="h-8 w-8 text-brand-600" aria-hidden="true" /><h3 className="mt-3 font-semibold text-ink-950">Our Mission</h3><p className="mt-1 text-sm text-ink-500">Deliver accurate job information to every aspirant in India.</p></div>
              <div className="card p-5"><Award className="h-8 w-8 text-brand-600" aria-hidden="true" /><h3 className="mt-3 font-semibold text-ink-950">Our Vision</h3><p className="mt-1 text-sm text-ink-500">Be the most trusted Sarkari job update platform in the country.</p></div>
            </div>
          </div>
          <div>
            {yt && (
              <div className="card p-6">
                <div className="flex items-center gap-4">
                  {yt.thumbnail && <img src={yt.thumbnail} alt={`${yt.title} channel logo`} width={64} height={64} className="h-16 w-16 rounded-full ring-2 ring-brand-100" />}
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-950">{yt.title}</h3>
                    <p className="text-sm text-ink-500">{yt.customUrl}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl bg-ink-50 p-4"><Users className="mx-auto h-6 w-6 text-brand-600" aria-hidden="true" /><p className="mt-2 text-xl font-bold text-ink-950">{formatNumber(yt.subscriberCount)}</p><p className="text-xs text-ink-400">Subscribers</p></div>
                  <div className="rounded-xl bg-ink-50 p-4"><Eye className="mx-auto h-6 w-6 text-brand-600" aria-hidden="true" /><p className="mt-2 text-xl font-bold text-ink-950">{formatNumber(yt.viewCount)}</p><p className="text-xs text-ink-400">Views</p></div>
                  <div className="rounded-xl bg-ink-50 p-4"><Video className="mx-auto h-6 w-6 text-brand-600" aria-hidden="true" /><p className="mt-2 text-xl font-bold text-ink-950">{formatNumber(yt.videoCount)}</p><p className="text-xs text-ink-400">Videos</p></div>
                </div>
                <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full"><Video className="h-4 w-4" aria-hidden="true" /> Subscribe on YouTube</a>
              </div>
            )}
            <div className="card mt-4 p-6">
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-brand-600" aria-hidden="true" /><div><p className="text-sm font-semibold text-ink-950">Email Us</p><a href={`mailto:${channel.email}`} className="text-sm text-brand-600 hover:underline">{channel.email}</a></div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
