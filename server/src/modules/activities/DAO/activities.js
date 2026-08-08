import { supabaseAdmin } from '../../../config/supabaseClient.js';
import { Logger } from '../../../utils/logger.js';

let instance = null;

export default class ActivitiesDAO {
  async save(data) {
    // Insert the activity, then attach its categories in a second insert.
    const { data: row, error } = await supabaseAdmin
      .from('activities')
      .insert({
        name: data.activity,
        description: data.description,
        image_url: data.img,
        image_alt: data.imgText,
        data_target: data.data_target,
      })
      .select()
      .single();
    if (error) throw error;

    if (Array.isArray(data.category) && data.category.length) {
      const { error: catError } = await supabaseAdmin
        .from('activity_categories')
        .insert(
          data.category.map((c, i) => ({
            activity_id: row.id,
            name: c.name,
            age_range: c.age_range,
            days: c.days,
            schedule: c.schedule,
            display_order: i,
          })),
        );
      if (catError) throw catError;
    }
    return row;
  }

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .select('*, category:activity_categories(*)')
      .order('name', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .select('*, category:activity_categories(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async update(id, data) {
    const updates = {};
    if (data.activity) updates.name = data.activity;
    if (data.description) updates.description = data.description;
    if (data.img) updates.image_url = data.img;
    if (data.imgText) updates.image_alt = data.imgText;

    if (Object.keys(updates).length) {
      const { error } = await supabaseAdmin
        .from('activities')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    }

    if (Array.isArray(data.category)) {
      // Replace the categories wholesale — simpler than diffing.
      await supabaseAdmin.from('activity_categories').delete().eq('activity_id', id);
      if (data.category.length) {
        const { error } = await supabaseAdmin
          .from('activity_categories')
          .insert(
            data.category.map((c, i) => ({
              activity_id: id,
              name: c.name,
              age_range: c.age_range,
              days: c.days,
              schedule: c.schedule,
              display_order: i,
            })),
          );
        if (error) throw error;
      }
    }
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async delete(id) {
    const { error } = await supabaseAdmin.from('activities').delete().eq('id', id);
    if (error) throw error;
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteAll() {
    const { error } = await supabaseAdmin
      .from('activities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (error) throw error;
    return { deletedCount: 1 };
  }

  static getInstance() {
    if (!instance) {
      instance = new ActivitiesDAO();
      Logger.level().info('ActivitiesDAO instance created');
    }
    return instance;
  }
}
