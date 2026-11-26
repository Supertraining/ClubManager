import { Logger } from '../../../utils/logger.js';
import { createUserClient } from '../../../config/supabaseClient.js';
import { CustomError } from '../../../utils/customError.Utils.js';
import { throwClubDbError } from '../../../utils/clubDbError.js';

let instance;
const editableFields = ['first_name', 'last_name', 'age', 'phone'];
const memberWithProfile = 'role,member_first_name,member_last_name,member_age,member_phone,profile:profiles!club_memberships_user_id_fkey(*)';

function toMemberProfile(membership, actorId) {
  if (!membership?.profile) return null;
  const profile = { ...membership.profile, role: membership.role, isAdmin: membership.role === 'admin' };
  if (actorId !== profile.id) {
    for (const field of editableFields) {
      profile[field] = membership['member_' + field] ?? profile[field];
    }
  }
  return profile;
}

export default class UsersDAO {
  async signUp({ email, password, firstName, lastName, age, phone }) {
    const { data, error } = await createUserClient().auth.signUp({
      email, password,
      options: { data: { first_name: firstName, last_name: lastName, age, phone } },
    });
    if (error) throw error;
    return data;
  }

  async signIn({ email, password }) {
    const { data, error } = await createUserClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async getByIdAsUser(id, clubId, actorId, accessToken) {
    const { data, error } = await createUserClient(accessToken).from('club_memberships')
      .select(memberWithProfile).eq('club_id', clubId).eq('user_id', id).eq('status', 'active').maybeSingle();
    if (error) throwClubDbError(error);
    return toMemberProfile(data, actorId);
  }

  async getAllAsAdmin(clubId, accessToken) {
    const { data, error } = await createUserClient(accessToken).from('club_memberships')
      .select(memberWithProfile).eq('club_id', clubId).eq('status', 'active').order('user_id');
    if (error) throwClubDbError(error);
    return data.map(row => toMemberProfile(row)).filter(Boolean);
  }

  async updateAsUser(id, updates, clubId, actorId, accessToken) {
    const userClient = createUserClient(accessToken);
    if (id === actorId) {
      const { error } = await userClient.from('profiles').update(updates).eq('id', id);
      if (error) throwClubDbError(error);
    } else {
      const scopedUpdates = Object.fromEntries(Object.entries(updates).map(([field, value]) => ['member_' + field, value]));
      const { error } = await userClient.from('club_memberships').update(scopedUpdates)
        .eq('club_id', clubId).eq('user_id', id).eq('status', 'active');
      if (error) throwClubDbError(error);
    }
    const profile = await this.getByIdAsUser(id, clubId, actorId, accessToken);
    if (!profile) throw CustomError.notFound('Socio no encontrado.');
    return profile;
  }

  async listMyReservations(clubId, userId, accessToken) {
    const { data, error } = await createUserClient(accessToken).from('reservations')
      .select('*, court:courts!reservation_club_court_fkey(name, display_name)')
      .eq('club_id', clubId).eq('user_id', userId).order('start_time', { ascending: false });
    if (error) throwClubDbError(error);
    return data;
  }

  async deleteMyReservation(id, clubId, accessToken) {
    if (!id) throw CustomError.badRequest('Elegí una reserva para cancelar.');
    const { data, error } = await createUserClient(accessToken).from('reservations')
      .delete().eq('club_id', clubId).eq('id', id).select('id').maybeSingle();
    if (error) throwClubDbError(error);
    if (!data) throw CustomError.notFound('Reserva no encontrada.');
    return { deletedCount: 1 };
  }

  static getInstance() {
    if (!instance) {
      instance = new UsersDAO();
      Logger.level().info('UsersDAO instance created');
    }
    return instance;
  }
}
