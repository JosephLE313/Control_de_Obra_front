// Classification only: database authorization must be enforced by RLS.
export function isPublicSupabaseKey(key: string): boolean {
  if (/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(key)) return true;
  if (key.startsWith('sb_secret_')) return false;
  const parts = key.split('.');
  if (parts.length !== 3 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role === 'anon';
  } catch { return false; }
}
export function isValidPublicSupabaseConfig(url: string, key: string): boolean {
  if (!isPublicSupabaseKey(key)) return false;
  try {
    const parsed = new URL(url);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    return (parsed.protocol === 'https:' || (local && parsed.protocol === 'http:')) &&
      !parsed.username && !parsed.password && !parsed.search && !parsed.hash && parsed.pathname === '/';
  } catch { return false; }
}
