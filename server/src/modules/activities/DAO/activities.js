import { createUserClient } from '../../../config/supabaseClient.js';
import { clubRpc } from '../../clubs/DAO/clubs.js';
import { throwClubDbError } from '../../../utils/clubDbError.js';
import { CustomError } from '../../../utils/customError.Utils.js';
import { Logger } from '../../../utils/logger.js';

let instance;
const fields = '*, category:activity_categories!category_club_activity_fkey(*)';

export default class ActivitiesDAO {
  save(data, clubId, token) {
    return this.write(null, data, clubId, token);
  }

  async getAll(clubId) {
    const { data, error } = await createUserClient().from('activities')
      .select(fields).eq('club_id', clubId).order('name');
    if (error) throwClubDbError(error);
    return data;
  }

  async getById(id, clubId, token) {
    const { data, error } = await createUserClient(token).from('activities')
      .select(fields).eq('club_id', clubId).eq('id', id).maybeSingle();
    if (error) throwClubDbError(error);
    return data;
  }

  write(id, data, clubId, token) {
    const changes = { name: data.activity, description: data.description, image_url: data.img, image_alt: data.imgText, data_target: data.data_target };
    const categories = Array.isArray(data.category) ? data.category.map((category, displayOrder) => ({
      name: category.name, age_range: category.age_range, days: category.days,
      schedule: category.schedule, display_order: displayOrder,
    })) : null;
    return clubRpc(token, 'save_club_activity', { p_club_id: clubId, p_id: id, p_changes: changes, p_category: categories });
  }

  async update(id, data, clubId, token) {
    await this.write(id, data, clubId, token);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async delete(id, clubId, token) {
    const { data, error } = await createUserClient(token).from('activities')
      .delete().eq('club_id', clubId).eq('id', id).select('id').maybeSingle();
    if (error) throwClubDbError(error);
    if (!data) throw CustomError.notFound('Actividad no encontrada.');
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteAll(clubId, token) {
    const { count, error } = await createUserClient(token).from('activities')
      .delete({ count: 'exact' }).eq('club_id', clubId);
    if (error) throwClubDbError(error);
    return { deletedCount: count ?? 0 };
  }

  static getInstance() {
    if (!instance) {
      instance = new ActivitiesDAO();
      Logger.level().info('ActivitiesDAO instance created');
    }
    return instance;
  }
}
