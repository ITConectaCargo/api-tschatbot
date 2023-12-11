import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.emailemnuvem.com.br', // hostname
  secure: true, // TLS requer que secure seja false
  port: 465, // porta para SMTP seguro
  auth: {
    user: process.env.EMAILBOT!,
    pass: process.env.EMAILBOTPASS!,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

// Função para enviar e-mail
const enviarEmail = async (
  destinatario: string[],
  assunto: string,
  corpo: string,
  anexos: any[]
) => {
  let emails = [...destinatario];
  const indiceBot = destinatario.indexOf(process.env.EMAILBOT!);
  if (indiceBot !== -1) {
    emails.splice(indiceBot, 1); // Remove o e-mail do Bot do array
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
    text: corpo,
    attachments: attachments,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('E-mail enviado:', info.response);
  return { enviado: info.response };
};

export default enviarEmail;
