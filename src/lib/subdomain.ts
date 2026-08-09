export function isToolSubdomain(pathname?: string): boolean {
  if (pathname?.startsWith('/tools')) return true;

  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    const hostParts = currentHost.split('.');
    const reservedSubdomains = ['www', 'admin', 'api', 'shridevfreelance', 'shrikeshdevfreelance', 'app'];

    let subdomain: string | null = null;
    if (currentHost.endsWith('localhost') || currentHost.endsWith('127.0.0.1')) {
      if (hostParts.length > 1 && hostParts[0] !== 'localhost') {
        subdomain = hostParts[0];
      }
    } else if (currentHost.includes('shridevfreelance.online')) {
      if (hostParts.length > 2) {
        subdomain = hostParts[0];
      }
    }

    if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
      return true;
    }
  }

  return false;
}
