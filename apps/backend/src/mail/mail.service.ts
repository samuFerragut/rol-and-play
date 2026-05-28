import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('BREVO_SMTP_HOST'),
      port: Number(this.configService.get<string>('BREVO_SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('BREVO_SMTP_USER'),
        pass: this.configService.get<string>('BREVO_SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const fromName = this.configService.get<string>('MAIL_FROM_NAME');
    const fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL');

    await this.transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: 'Restablece tu contraseña en Rol&Play',
      html: `
        <div style="background:#0B0B0D;padding:32px;font-family:Arial,sans-serif;color:#F2E6D0;">
          <div style="max-width:560px;margin:0 auto;background:#141416;border:1px solid #C6A15B;border-radius:18px;padding:32px;">
            <h1 style="color:#C6A15B;margin:0 0 16px;">Rol&Play</h1>

            <p>Has solicitado restablecer tu contraseña.</p>

            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

            <p style="margin:32px 0;">
              <a href="${resetUrl}"
                 style="background:#8F1D1D;color:#E7C77A;padding:14px 22px;border:1px solid #C6A15B;border-radius:12px;text-decoration:none;font-weight:bold;">
                Restablecer contraseña
              </a>
            </p>

            <p>Este enlace caduca en 30 minutos.</p>

            <p style="color:#B9A88A;font-size:13px;">
              Si no has solicitado este cambio, puedes ignorar este correo.
            </p>
          </div>
        </div>
      `,
    });
  }
}
