import { useEffect } from 'react';
import { channel } from '../content/channel';

export const SITE_URL = 'https://careerupdatezone.com';

type SchemaObject = Record<string, unknown>;

type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  keywords?: string[];
  prev?: { url: string; title: string };
  next?: { url: string; title: string };
  schema?: SchemaObject | SchemaObject[];
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeLink(rel: string) {
  document.querySelector(`link[rel="${rel}"]`)?.remove();
}

function upsertSchema(id: string, data: SchemaObject | SchemaObject[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeById(id: string) {
  document.getElementById(id)?.remove();
}

export function Seo({ title, description, canonical, ogImage, ogType = 'website', noindex = false, keywords, prev, next, schema }: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${channel.name}` : `${channel.name} — Sarkari Job Updates, Results & Career Guidance`;
    document.title = fullTitle;

    const desc = description || channel.tagline;
    const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
    const image = ogImage || 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg';

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow');
    } else {
      upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'author', channel.name);

    if (keywords && keywords.length > 0) {
      upsertMeta('name', 'keywords', keywords.join(', '));
    } else {
      removeMeta('name', 'keywords');
    }

    upsertLink('canonical', canonicalUrl);

    if (prev) {
      upsertLink('prev', `${SITE_URL}${prev.url}`);
    } else {
      removeLink('prev');
    }
    if (next) {
      upsertLink('next', `${SITE_URL}${next.url}`);
    } else {
      removeLink('next');
    }

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('property', 'og:site_name', channel.name);
    upsertMeta('property', 'og:locale', 'en_IN');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:site', '@careerupdatezonee');
    upsertMeta('name', 'twitter:creator', '@careerupdatezonee');

    const orgSchema: SchemaObject = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: channel.name,
      url: SITE_URL,
      description: channel.description,
      email: channel.email,
      sameAs: [channel.youtubeUrl],
    };

    const websiteSchema: SchemaObject = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: channel.name,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    upsertSchema('schema-organization', orgSchema);
    upsertSchema('schema-website', websiteSchema);

    if (schema) {
      upsertSchema('schema-page', schema);
    } else {
      removeById('schema-page');
    }

    return () => {
      removeById('schema-page');
      removeLink('prev');
      removeLink('next');
    };
  }, [title, description, canonical, ogImage, ogType, noindex, keywords, prev, next, schema]);

  return null;
}

export function buildPersonSchema(name: string, url?: string): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(url ? { url: `${SITE_URL}${url}` } : {}),
    jobTitle: 'Career Guidance Expert',
    worksFor: { '@type': 'Organization', name: channel.name, url: SITE_URL },
  };
}
