const path = window.location.pathname.split('/');
const hasClubPrefix = path[1] === 'clubes';

export const clubSlug = hasClubPrefix ? path[2] : 'ranelagh';
export const clubBase = hasClubPrefix ? '/clubes/' + clubSlug : '';
export const clubPath = (relativePath) => clubBase + relativePath;
export const clubStorage = (key) => clubSlug === 'ranelagh' ? key : key + '.' + clubSlug;

export function clubApi(origin) {
  return origin.replace(/\/$/, '') + '/clubs/' + encodeURIComponent(clubSlug || 'club-invalido');
}
