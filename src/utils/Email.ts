import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface EmailParams {
  destinatarios: string[];
  assunto: string;
  corpoEmail: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      const info = await transporter.sendMail(mailOptions);
      console.log('E-mail enviado:', info.response);
    } catch (error) {
      console.log(`Erro ao enviar Email`);
      console.log(error);
    }
  }

  public async enviarEmail({
    destinatarios,
    assunto,
    corpoEmail,
    anexos,
  }: EmailParams): Promise<void> {
    try {
      const emails = [...destinatarios];
      const indiceBot = destinatarios.indexOf(process.env.EMAILBOT!);
      if (indiceBot !== -1) {
        emails.splice(indiceBot, 1);
      }
      console.log(emails);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      console.log(error);
    }
  }
}
