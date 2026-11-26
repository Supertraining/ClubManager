import { CustomError } from "../../../utils/customError.Utils.js";
import { Logger } from "../../../utils/logger.js";
import { UserNotifications } from "../helpers/emailNotifications.helper.js";
import { clubRpc } from '../../clubs/DAO/clubs.js';

/**
 * UsersServices — orchestrates the UsersDAO + email notifications.
 *
 * Auth endpoints (register, login) return the Supabase `access_token` so the
 * client can call protected endpoints without a second round-trip.
 */
export default class UsersServices {
  constructor(userDAO, notifications = new UserNotifications()) {
    this.repository = userDAO;
    this.notifications = notifications;
  }

  async register({ username, password, nombre, apellido, edad, telefono }, club) {
    if (!username || !password) {
      throw CustomError.badRequest('Email y contraseña son obligatorios');
    }

    const { user, session } = await this.repository.signUp({
      email: username,
      password,
      firstName: nombre,
      lastName: apellido,
      age: Number(edad),
      phone: telefono,
    });

    if (!session) {
      // Supabase may require email confirmation depending on project settings.
      // In that case `session` is null but `user` exists. The client can show
      // a "check your email" message.
      return { user, session: null, requiresEmailConfirmation: true };
    }

    if (club.signup_mode === 'open') await clubRpc(session.access_token, 'join_club', { p_club_id: club.id });

    // Best-effort welcome email; never fail the signup on email issues.
    this.notifications.emailNewUserNotification(user.email)
      .catch(() => Logger.level().warn('Welcome email could not be sent'));

    return {
      token: session.access_token,
      user: { id: user.id, email: user.email },
    };
  }

  async login({ username, password }) {
    if (!username || !password) {
      throw CustomError.badRequest('Email y contraseña son obligatorios');
    }
    const { user, session } = await this.repository.signIn({
      email: username,
      password,
    });
    if (!user || !session) throw CustomError.unauthorized('Credenciales inválidas');
    return {
      token: session.access_token,
      user: { id: user.id, email: user.email },
    };
  }

  async getById(id, clubId, actorId, accessToken) {
    const user = await this.repository.getByIdAsUser(id, clubId, actorId, accessToken);
    if (!user) throw CustomError.notFound('Usuario no encontrado');
    return user;
  }

  async getAllUsers(clubId, accessToken) {
    return this.repository.getAllAsAdmin(clubId, accessToken);
  }

  async updateUser(id, data, clubId, actorId, accessToken) {
    const updates = {};
    for (const [field, value] of Object.entries({
      first_name: data.first_name ?? data.nombre,
      last_name: data.last_name ?? data.apellido,
      phone: data.phone ?? data.telefono,
    })) {
      if (value === undefined) continue;
      if (typeof value !== 'string' || (field !== 'phone' && !value.trim()) || value.trim().length > 80) {
        throw CustomError.badRequest('Revisá el nombre, el apellido y el teléfono.');
      }
      updates[field] = value.trim();
    }
    const age = data.age ?? data.edad;
    if (age !== undefined) {
      if (!Number.isInteger(Number(age)) || Number(age) < 12 || Number(age) > 99) {
        throw CustomError.badRequest('Ingresá una edad entre 12 y 99 años.');
      }
      updates.age = Number(age);
    }
    if (Object.keys(updates).length === 0) {
      throw CustomError.badRequest('Nada para actualizar');
    }
    return this.repository.updateAsUser(id, updates, clubId, actorId, accessToken);
  }

  async deleteById(id, clubId, accessToken) {
    await clubRpc(accessToken, 'suspend_club_member', { p_club_id: clubId, p_user_id: id });
    return { deletedCount: 1 };
  }

  async getMyReservations(clubId, userId, accessToken) {
    return this.repository.listMyReservations(clubId, userId, accessToken);
  }

  async deleteMyReservation(reservationId, clubId, accessToken) {
    return this.repository.deleteMyReservation(reservationId, clubId, accessToken);
  }
}
