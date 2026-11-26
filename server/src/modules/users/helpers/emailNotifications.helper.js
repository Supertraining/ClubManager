import nodemailer from 'nodemailer';
import { gmailPass, gmailPort, gmailService, gmailUser } from '../../../config/config.js';

const transport = gmailUser && gmailPass
  ? nodemailer.createTransport({
      service: gmailService,
      port: gmailPort,
      auth: { user: gmailUser, pass: gmailPass },
    })
  : null;

export class UserNotifications {
  constructor(mailer = transport) {
    this.mailer = mailer;
  }

  async emailNewUserNotification(to) {
    await this.mailer?.sendMail({
      from: { name: 'Club Ranelagh', address: gmailUser },
      to,
      subject: 'Te damos la bienvenida al Club Ranelagh',
      text: 'Ya podés entrar a ClubManager para consultar las actividades y reservar una cancha.',
    });
  }

  async emailPasswordChangedNotification(to) {
    await this.mailer?.sendMail({
      from: { name: 'Club Ranelagh', address: gmailUser },
      to,
      subject: 'Cambió tu contraseña de ClubManager',
      text: 'Se actualizó tu contraseña. Si no esperabas este cambio, ponete en contacto con el club.',
    });
  }
}
