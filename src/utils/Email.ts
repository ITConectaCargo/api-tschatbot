import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
import AppError from '@utils/AppError'; // Substitua pelo caminho correto para o AppError
dotenv.config();

interface EmailParams {
  destinatarios: string[];
  assunto: string;
  corpoEmail: string;
  anexos: any[];
}

export default class Email {
  private async transmitir(mailOptions: SendMailOptions): Promise<void> {
    try {
      const transporter: Transporter = nodemailer.createTransport({
        host: 'smtp.emailemnuvem.com.br',
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAILBOT!,
          pass: process.env.EMAILBOTPASS!,
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });

      // const info = await transporter.sendMail(mailOptions);

      // console.log('E-mail enviado:', info.response);
    } catch (error) {
      throw new AppError('Erro ao enviar e-mail', 500); // Use o status de erro apropriado
    }
  }

  public async enviarEmail({
    destinatarios,
    assunto,
    corpoEmail,
    anexos,
  }: EmailParams): Promise<void> {
    try {
      let emails = [...destinatarios];
      const indiceBot = destinatarios.indexOf(process.env.EMAILBOT!);
      if (indiceBot !== -1) {
        emails.splice(indiceBot, 1);
      }
      console.log(emails);

      let attachments: any[] = [];

      if (anexos) {
        attachments = anexos;
      }

      const mailOptions: SendMailOptions = {
        from: process.env.EMAILBOT!,
        to: emails,
        subject: assunto,
        text: corpoEmail,
        attachments: attachments,
      };

      await this.transmitir(mailOptions);
    } catch (error) {
      throw new AppError('Erro ao preparar e enviar e-mail', 500); // Use o status de erro apropriado
    }
  }
}
