const RESERVED_LABELS = ['www', 'admin', 'app', 'api'];

export function getSubdomainSlug(): string | null {
  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN;
  const hostname = window.location.hostname;

  if (!rootDomain) return null;
  if (hostname === rootDomain) return null;
  if (!hostname.endsWith(`.${rootDomain}`)) return null;

  const label = hostname.slice(0, -(`.${rootDomain}`.length));

  if (!label || label.includes('.')) return null;
  if (RESERVED_LABELS.includes(label)) return null;

  return label;
}

export function getInvitationUrl(slug: string): string {
  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN;

  if (!rootDomain) {
    return `/?slug=${slug}`;
  }

  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';

  return `${protocol}//${slug}.${rootDomain}${port}/`;
}
