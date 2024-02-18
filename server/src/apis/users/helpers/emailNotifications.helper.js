import nodemailer from 'nodemailer';
import { gmailData } from '../../../config/config.js'
import { CustomError } from '../../../utils/customError.Utils.js';


export class UserNotifications {

  static emailNewUserNotification = async (username, data) => {

    const transporter = nodemailer.createTransport({
      service: gmailData.gmailService,
      port: gmailData.gmailPort,
      auth: {
        user: gmailData.gmailUser,
        pass: gmailData.gmailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailContent = {

      from: `Ranelagh Club <noreply@example.com>`,
      to: `${data.nombre} ${data.apellido} <${username}>`,
      subject: 'Gracias por registrarte en la App del Ranelagh Club',
      html: `<html><style>div{padding:10px; display: flex; flex-direction: column; align-items: center; width: 80%; border: 1px solid green}</style><body><p>¡¡<b>${data.nombre}</b>, Bienvenido  a nuestra App!!.<br>
      Desde la misma podrás reservar la cancha que desees desde donde estés, ver información sobre nuestras actividades, enviarnos un msj de whatsapp y chequear nuestras redes sociales.</p><h3 style="text-decoration: underline">Tus datos.</h3><div><ul style="list-style: none"><li><b>Usuario:</b> ${username}</li><li><b>Contraseña:</b> ${data.password}</li><li><b>Nombre:</b> ${data.nombre}</li><li><b>Apellido:</b> ${data.apellido}</li><li><b>Edad:</b> ${data.edad}</li><li><b>Teléfono:</b> ${data.telefono}</li></ul></div></body></html>`,

    }

    try {

      let info = await transporter.sendMail(emailContent);
      console.log(info);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    } catch (error) {
     throw CustomError.internalError()
    }
  }

  static emailUpdatePasswordNotification = async (data) => {

    const transporter = nodemailer.createTransport({
      service: gmailData.gmailService,
      port: gmailData.gmailPort,
      auth: {
        user: gmailData.gmailUser,
        pass: gmailData.gmailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailContent = {

      from: `Ranelagh Club <noreply@example.com>`,
      to: `${data.nombre} ${data.apellido} <${data.username}>`,
      subject: 'Contraseña actualizada',
      html: `<html><style>div{padding:10px; display: flex; flex-direction: column; align-items: center; width: 80%; border: 1px solid green}</style><body><p><b>${data.nombre}</b>,<br>
      tu contraseña ha sido actualizada con éxito.</p><div><ul style="list-style: none"><li><b>Nueva contraseña:</b> ${data.password}</li></ul><br><p>¡Saludos!<br>Ranelagh Club.</p></div></body></html>`,

    }

    try {

      let info = await transporter.sendMail(emailContent);
      console.log(info);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    } catch (error) {
      CustomError.internalError();

    }
  }
}
