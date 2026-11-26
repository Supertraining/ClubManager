import { CustomError } from '../../../utils/customError.Utils.js';
import { clubRpc, updateClub } from '../DAO/clubs.js';

export function publicClub(club) {
  const readOnly = Boolean(club.billing_required && !(Date.parse(club.paid_through) > Date.now()));
  return {
    slug: club.slug,
    name: club.name,
    timezone: club.timezone,
    logoUrl: club.logo_url ?? null,
    coverImageUrl: club.cover_image_url ?? null,
    contact: club.contact ?? {},
    signupMode: club.signup_mode,
    bookingEnabled: club.booking_enabled && !readOnly,
    readOnly,
  };
}

function httpsUrl(input) {
  if (input === null || input === '') return null;
  try {
    const parsed = new URL(input);
    if (typeof input === 'string' && parsed.protocol === 'https:' && !parsed.username && !parsed.password) return parsed.href;
  } catch {
    // Report the same input error for malformed and non-HTTPS URLs.
  }
  throw CustomError.badRequest('Ingresá un enlace HTTPS válido.');
}

export async function saveSettings(clubId, body, accessToken) {
  const { name, logoUrl, coverImageUrl, contact, signupMode } = body;
  const settings = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) throw CustomError.badRequest('Ingresá un nombre de hasta 100 caracteres.');
    settings.name = name.trim();
  }
  if (logoUrl !== undefined) settings.logo_url = httpsUrl(logoUrl);
  if (coverImageUrl !== undefined) settings.cover_image_url = httpsUrl(coverImageUrl);
  if (signupMode !== undefined) {
    if (!['open', 'invitation'].includes(signupMode)) throw CustomError.badRequest('Elegí el tipo de alta de socios.');
    settings.signup_mode = signupMode;
  }
  if (contact !== undefined) {
    if (!contact || typeof contact !== 'object' || Array.isArray(contact)) throw CustomError.badRequest('Ingresá datos de contacto válidos.');
    const cleanContact = {};
    for (const field of ['address', 'whatsapp', 'instagram', 'facebook']) {
      if (contact[field] === undefined || contact[field] === '') continue;
      if (typeof contact[field] !== 'string' || contact[field].length > 300) throw CustomError.badRequest('Revisá los datos de contacto.');
      cleanContact[field] = field === 'address' || field === 'whatsapp' ? contact[field].trim() : httpsUrl(contact[field]);
    }
    settings.contact = cleanContact;
  }
  if (Object.keys(settings).length === 0) throw CustomError.badRequest('Ingresá al menos un dato para actualizar.');
  const updated = await updateClub(clubId, settings, accessToken);
  if (!updated) throw CustomError.forbidden('Tu cuenta ya no tiene permiso para editar el club.');
  return publicClub(updated);
}

export async function joinClub(clubId, accessToken) {
  const role = await clubRpc(accessToken, 'join_club', { p_club_id: clubId });
  return { role, isAdmin: role === 'admin' };
}
