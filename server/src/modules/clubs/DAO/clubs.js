import { createUserClient } from '../../../config/supabaseClient.js';
import { throwClubDbError } from '../../../utils/clubDbError.js';

const fields = 'id,slug,name,timezone,logo_url,cover_image_url,contact,signup_mode,booking_enabled,billing_required,paid_through';

export async function findClub(slug) {
  const { data, error } = await createUserClient().from('clubs')
    .select(fields).eq('slug', slug).eq('published', true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function findMembership(clubId, userId, accessToken) {
  const { data, error } = await createUserClient(accessToken).from('club_memberships')
    .select('role,status').eq('club_id', clubId).eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (error) throwClubDbError(error);
  return data;
}

export async function updateClub(clubId, settings, accessToken) {
  const { data, error } = await createUserClient(accessToken).from('clubs')
    .update(settings).eq('id', clubId).select(fields).maybeSingle();
  if (error) throwClubDbError(error);
  return data;
}

export async function clubRpc(accessToken, name, parameters) {
  const { data, error } = await createUserClient(accessToken).rpc(name, parameters);
  if (error) throwClubDbError(error);
  return data;
}
