const path = window.location.pathname.split('/');
const hasClubPrefix = path[1] === 'clubes';

export const clubSlug = hasClubPrefix ? path[2] : 'ranelagh';
export const clubBase = hasClubPrefix ? '/clubes/' + clubSlug : '';
export const clubPath = (relativePath) => clubBase + relativePath;
export const clubStorage = (key) => clubSlug === 'ranelagh' ? key : key + '.' + clubSlug;

export function clubApi(origin) {
  return origin.replace(/\/$/, '') + '/clubs/' + encodeURIComponent(clubSlug || 'club-invalido');
}

export function safeClubReturn(candidate) {
  if (!candidate?.startsWith('/') || candidate.startsWith('//')) return '/';
  try {
    const target = new URL(candidate, window.location.origin);
    if (target.origin !== window.location.origin) return '/';
    if (clubBase && (target.pathname === clubBase || target.pathname.startsWith(clubBase + '/'))) {
      return (target.pathname.slice(clubBase.length) || '/') + target.search + target.hash;
    }
    if (target.pathname.startsWith('/clubes/')) return '/';
    return target.pathname + target.search + target.hash;
  } catch {
    return '/';
  }
}
