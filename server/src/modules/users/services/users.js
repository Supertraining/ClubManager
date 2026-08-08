import { CustomError } from "../../../utils/customError.Utils.js";
import { UserNotifications } from "../helpers/emailNotifications.helper.js";

/**
 * UsersServices — orchestrates the UsersDAO + email notifications.
 *
 * Auth endpoints (register, login) return the Supabase `access_token` so the
 * client can call protected endpoints without a second round-trip.
 */
export default class UsersServices {
  constructor(userDAO) {
    this.repository = userDAO;
  }

  async register({ username, password, nombre, apellido, edad, telefono }) {
    if (!username || !password) {
      throw CustomError.badRequest('Email y contraseña son obligatorios');
    }

    // Pre-check: avoid creating a duplicate signup request.
    // (The DB has unique constraints; this just gives a friendlier error.)
    const { data: existing, error: lookupError } = await this.repository
      .signIn({ email: username, password: '__check__' })
      .then(() => ({ data: { user: null }, error: null }))
      .catch(() => ({ data: null, error: null }));
    // (Supabase always throws on bad password; we swallow and just attempt the signup.)

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

    // Best-effort welcome email; never fail the signup on email issues.
    UserNotifications.emailNewUserNotification(username, {
      nombre, apellido, password, edad, telefono,
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Welcome email failed (non-fatal):', err?.message);
    });

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

  async getById(id, accessToken) {
    const user = await this.repository.getByIdAsUser(id, accessToken);
    if (!user) throw CustomError.notFound('Usuario no encontrado');
    return user;
  }

  async getAllUsers(accessToken) {
    return this.repository.getAllAsAdmin(accessToken);
  }

  async updateUser(id, data, accessToken) {
    const updates = {};
    if (data.nombre) updates.first_name = data.nombre;
    if (data.apellido) updates.last_name = data.apellido;
    if (data.edad) updates.age = Number(data.edad);
    if (data.telefono) updates.phone = data.telefono;
    if (Object.keys(updates).length === 0) {
      throw CustomError.badRequest('Nada para actualizar');
    }
    return this.repository.updateAsUser(id, updates, accessToken);
  }

  async updateUserPassword({ _id, password }, accessToken) {
    if (!_id || !password) throw CustomError.badRequest('Id y contraseña son obligatorios');
    await this.repository.adminUpdatePassword(_id, password);
    UserNotifications.emailUpdatePasswordNotification({ _id, password })
      .catch((err) => console.warn('Password-change email failed (non-fatal):', err?.message));
    return this.repository.getByIdAsUser(_id, accessToken);
  }

  async deleteById(id, accessToken) {
    return this.repository.deleteAsAdmin(id, accessToken);
  }

  async getMyReservations(accessToken) {
    return this.repository.listMyReservations(accessToken);
  }

  async deleteMyReservation(reservationId, accessToken) {
    return this.repository.deleteMyReservation(reservationId, accessToken);
  }
}
